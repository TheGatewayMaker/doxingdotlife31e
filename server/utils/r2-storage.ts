import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

interface PostMetadata {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  server: string;
  nsfw?: boolean;
  mediaFiles: string[];
  createdAt: string;
}

const getR2Client = (): S3Client => {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const accountId = process.env.R2_ACCOUNT_ID;

  if (!accessKeyId || !secretAccessKey || !accountId) {
    const missing = [];
    if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID");
    if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
    if (!accountId) missing.push("R2_ACCOUNT_ID");

    console.error("Missing R2 env variables:", missing);
    console.error(
      "Available env keys:",
      Object.keys(process.env).filter(
        (k) => k.startsWith("R2_") || k.startsWith("VITE_"),
      ),
    );
    console.error("Environment:", process.env.NODE_ENV);

    throw new Error(
      `Missing required R2 environment variables: ${missing.join(", ")}. Please set these in your Netlify environment settings.`,
    );
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  try {
    const client = new S3Client({
      region: "auto",
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    console.log(`[${new Date().toISOString()}] R2 Client initialized successfully with endpoint: ${endpoint}`);
    return client;
  } catch (error) {
    console.error("Failed to initialize R2 client:", error);
    throw error;
  }
};

const getBucketName = (): string => {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Missing required environment variable: R2_BUCKET_NAME");
  }
  return bucketName;
};

export const getMediaUrl = (key: string): string => {
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!publicUrl) {
    console.warn(
      "R2_PUBLIC_URL not set. Media files may not load properly. Please set R2_PUBLIC_URL in your environment variables.",
    );
  }

  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !bucketName) {
    throw new Error(
      "Missing R2_PUBLIC_URL and cannot construct URL without R2_ACCOUNT_ID and R2_BUCKET_NAME",
    );
  }

  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
};

export const uploadMediaFile = async (
  postId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = `posts/${postId}/${fileName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000",
      Metadata: {
        "Cache-Control": "public, max-age=31536000",
      },
    }),
  );

  return getMediaUrl(key);
};

export const uploadPostMetadata = async (
  postId: string,
  metadata: PostMetadata,
): Promise<void> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = `posts/${postId}/metadata.json`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(metadata, null, 2),
      ContentType: "application/json",
    }),
  );
};

export const listPostFolders = async (): Promise<string[]> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const postIds: Set<string> = new Set();

  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "posts/",
        Delimiter: "/",
        ContinuationToken: continuationToken,
      }),
    );

    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        if (prefix.Prefix) {
          const postId = prefix.Prefix.replace("posts/", "").replace("/", "");
          if (postId) {
            postIds.add(postId);
          }
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return Array.from(postIds);
};

export const getPostMetadata = async (
  postId: string,
): Promise<PostMetadata | null> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = `posts/${postId}/metadata.json`;

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    if (response.Body) {
      const bodyString = await response.Body.transformToString();
      return JSON.parse(bodyString) as PostMetadata;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const listPostFiles = async (postId: string): Promise<string[]> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const files: string[] = [];

  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `posts/${postId}/`,
        ContinuationToken: continuationToken,
      }),
    );

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (
          obj.Key &&
          obj.Key !== `posts/${postId}/metadata.json` &&
          obj.Key !== `posts/${postId}/`
        ) {
          files.push(obj.Key.split("/").pop() || "");
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files.filter((f) => f);
};

export const updateServersList = async (servers: string[]): Promise<void> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = "servers/list.json";

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(servers, null, 2),
      ContentType: "application/json",
    }),
  );
};

export const getServersList = async (): Promise<string[]> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = "servers/list.json";

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    if (response.Body) {
      const bodyString = await response.Body.transformToString();
      return JSON.parse(bodyString) as string[];
    }

    return [];
  } catch (error) {
    return [];
  }
};

interface PostMetadataWithThumbnail extends PostMetadata {
  thumbnail?: string;
}

export const uploadPostMetadataWithThumbnail = async (
  postId: string,
  metadata: PostMetadata,
  thumbnailUrl: string,
): Promise<void> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = `posts/${postId}/metadata.json`;

  const metadataWithThumbnail: PostMetadataWithThumbnail = {
    ...metadata,
    thumbnail: thumbnailUrl,
  };

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(metadataWithThumbnail, null, 2),
      ContentType: "application/json",
    }),
  );
};

export interface PostWithThumbnail extends PostMetadata {
  thumbnail?: string;
}

export const getPostWithThumbnail = async (
  postId: string,
): Promise<PostWithThumbnail | null> => {
  const metadata = await getPostMetadata(postId);
  if (!metadata) {
    return null;
  }

  let thumbnail: string | undefined;

  const metadataWithThumbnail = metadata as PostMetadataWithThumbnail;
  if (metadataWithThumbnail.thumbnail) {
    thumbnail = metadataWithThumbnail.thumbnail;
  } else if (metadata.mediaFiles && metadata.mediaFiles.length > 0) {
    const firstMediaFile = metadata.mediaFiles[0];
    thumbnail = getMediaUrl(`posts/${postId}/${firstMediaFile}`);
  }

  return {
    ...metadata,
    thumbnail,
  };
};

export const deleteMediaFile = async (
  postId: string,
  fileName: string,
): Promise<void> => {
  const client = getR2Client();
  const bucketName = getBucketName();
  const key = `posts/${postId}/${fileName}`;

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );

  const metadata = await getPostMetadata(postId);
  if (metadata && metadata.mediaFiles) {
    const updatedMediaFiles = metadata.mediaFiles.filter((f) => f !== fileName);
    const updatedMetadata: PostMetadata = {
      ...metadata,
      mediaFiles: updatedMediaFiles,
    };
    await uploadPostMetadata(postId, updatedMetadata);
  }
};

export const deletePostFolder = async (postId: string): Promise<void> => {
  try {
    const client = getR2Client();
    const bucketName = getBucketName();

    console.log(`[${new Date().toISOString()}] Starting deletion of post ${postId}`);

    const files = await listPostFiles(postId);
    files.push("metadata.json");

    if (files.length === 0) {
      console.warn(`No files found for post ${postId}`);
      return;
    }

    console.log(`[${new Date().toISOString()}] Deleting ${files.length} files from post ${postId}`);

    const deleteErrors: Array<{ file: string; error: string }> = [];

    for (const file of files) {
      try {
        const key = `posts/${postId}/${file}`;
        console.log(`Deleting ${key}`);

        await client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );

        console.log(`✅ Deleted ${key}`);
      } catch (fileError) {
        const errorMsg = fileError instanceof Error ? fileError.message : String(fileError);
        console.error(`Failed to delete file ${file}:`, errorMsg);
        deleteErrors.push({
          file,
          error: errorMsg,
        });
      }
    }

    if (deleteErrors.length > 0) {
      const errorSummary = deleteErrors
        .map((e) => `${e.file}: ${e.error}`)
        .join("; ");
      console.error(`Some files failed to delete for post ${postId}: ${errorSummary}`);
      throw new Error(
        `Failed to delete ${deleteErrors.length} file(s) from post. Details: ${errorSummary}`,
      );
    }

    console.log(`[${new Date().toISOString()}] ✅ Successfully deleted post ${postId}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `[${new Date().toISOString()}] Error deleting post ${postId}:`,
      errorMsg,
    );
    throw error;
  }
};

export const updatePostMetadataField = async (
  postId: string,
  updates: Partial<PostMetadata>,
): Promise<PostMetadata | null> => {
  const metadata = await getPostMetadata(postId);
  if (!metadata) {
    return null;
  }

  const updatedMetadata: PostMetadata = {
    ...metadata,
    ...updates,
    id: metadata.id,
    createdAt: metadata.createdAt,
    mediaFiles: metadata.mediaFiles,
  };

  await uploadPostMetadata(postId, updatedMetadata);

  // Verify the upload was successful by reading it back
  const verifiedMetadata = await getPostMetadata(postId);
  if (!verifiedMetadata) {
    throw new Error("Failed to verify post metadata update");
  }

  return verifiedMetadata;
};

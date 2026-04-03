export default function uploadPreSign(
  presignedUrl: string,
  fileUri: string,
  onProgress: (percent: number) => void,
) {
  console.log("Starting upload to presigned URL:", presignedUrl);
  console.log("File URI:", fileUri);

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(percent);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error:", xhr.statusText, " - ", xhr.responseText);
      reject(new Error("Upload failed"));
    };

    xhr.onabort = () => {
      console.warn("Upload aborted");
      reject(new Error("Upload aborted"));
    };

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.error(
          "Upload failed:",
          xhr.statusText,
          " - ",
          xhr.responseText,
        );
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }

      resolve();
    };

    fetch(fileUri)
      .then((res) => res.blob())
      .then((blob) => xhr.send(blob))
      .catch((err) => {
        console.error("Error:", err);
        reject(err);
      });
  });
}

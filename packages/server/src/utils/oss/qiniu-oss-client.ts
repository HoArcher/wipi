import * as qiniu from 'qiniu';

import { OssClient } from './oss-client';

export class QiniuyunOssClient extends OssClient {
  private buildUploadKey(filepath: string) {
    const config = this.config;
    //需要填写你的 Access Key 和 Secret Key
    const accessKey = config.ACCESS_KEY;
    const secretKey = config.SECRET_KEY;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // 准备上传参数
    const options = {
      scope: config.bucket, // 替换为你的存储空间名称
      key: `wipi-oss${filepath}`, // 替换为目标路径和文件名
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);

    return putPolicy.uploadToken(mac);
  }

  async putFile(filepath: string, buffer: ReadableStream) {
    const uploadToken = this.buildUploadKey(filepath);
    // 创建上传表单
    const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config());
    const putExtra = new qiniu.form_up.PutExtra();
    return formUploader
      .put(uploadToken, `wipi-oss${filepath}`, buffer, putExtra)
      .then(({ data, resp }) => {
        if (resp.statusCode === 200) {
          return `${this.config.domain}/${data.key}`;
        } else {
          console.log(resp.statusCode);
          console.log(data);
        }
      })
      .catch((err) => {
        console.log('put failed', err);
      });
  }

  async deleteFile(url: string) {
    const client = this.buildUploadKey();
    await client.delete(url);
  }
}

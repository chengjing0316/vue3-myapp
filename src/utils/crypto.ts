// 定义加密/解密算法
import CryptoJS, { AES, enc, MD5, DES } from 'crypto-js'
const cryptoKey = '1024@@_#1024@@_#'
// const SECRET_IV = '1024@@_#1024@@_#'
// AES 加密
export const AES_Encrypt = (data: string) => {
  if (!data) return ''
  return AES.encrypt(data, cryptoKey).toString()
}
// AES 解密
export const AES_Decrypt = (data: string) => {
  if (!data) return ''
  return AES.decrypt(data, cryptoKey).toString(enc.Utf8)
}
// DES 加密
export function DES_Encrypt(data?: string): string {
  if (!data) return ''
  return DES.encrypt(String(data), cryptoKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString()
}
// DES 解密
export function DES_Decrypt(data?: string): string {
  if (!data) return ''
  return DES.decrypt(data, cryptoKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString(enc.Utf8)
}

// MD5 加密 (无法解密)
export function MD5_Encrypt(data?: string): string {
  if (!data) return ''
  return MD5(String(data)).toString()
}

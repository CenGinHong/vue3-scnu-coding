export function scoreTagColor (score: number): string {
  if (score >= 90) {
    return 'green'
  } else if (score < 90 && score >= 80) {
    return 'cyan'
  } else if (score < 80 && score >= 70) {
    return 'purple'
  } else if (score < 70 && score >= 60) {
    return 'orange'
  } else if (score < 60 && score >= 0) {
    return 'red'
  } else {
    return 'default'
  }
}

export function randomString (e: number):string {
  e = e || 32
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

export function randomNumberString (e: number):string {
  e = e || 32
  const t = '012345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

export function getExt (fileName: string): string {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export function getBase64 (file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

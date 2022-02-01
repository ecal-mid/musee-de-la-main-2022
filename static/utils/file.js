export async function loadJSON(url, ...options) {
  return await fetch(url, ...options).then(resp => resp.json())
}

export async function execExternalScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    document.head.appendChild(script)
    script.onload = resolve
    script.onerror = reject

    Object.entries(options).forEach(([key, value]) => {
      script[key] = value
    })

    script.src = src
  })
}
const paging = (result, options) => {
  // useful in debugging templates with read
  if (
    !!!options.paging[0] ||
    (options.paging[0] === 0 && !!!options.paging[1])
  ) {
    return result
  }
  if (options.paging[0] > 0 && !!!options.paging[1]) {
    return result.slice(options.paging[0] - 1)
  }
  if (options.paging[1]) {
    return result.slice(
      options.paging[0] - 1,
      options.paging[0] - 1 + options.paging[1]
    )
  }
}

export { paging }

export const extractLoginResult = (output) => {
  if (output?.status === 'error') return 'error'

  return output?.output
    ?.split('\n')
    .filter((x) => !!x)
    .pop()
}

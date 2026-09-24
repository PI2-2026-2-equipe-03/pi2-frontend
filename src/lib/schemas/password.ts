// regex de complexidade de senha — usada no cadastro e na redefinição de senha
export const passwordComplexityRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

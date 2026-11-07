// regex de complexidade de senha, usada no cadastro e na redefinição
export const passwordComplexityRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

describe('smoke test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders DOM', () => {
    cy.get('#root').should('exist')
  })
})

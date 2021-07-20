describe('CreateAccount', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://postman-echo.com/post', req => {
      req.reply({
        statusCode: 200,
      });
    }).as('signup');
  });

  it('успешно регистрируюсь', () => {
    cy.visit('/');

    cy.findByLabelText(/email/i).type('test@test.com');
    cy.findByLabelText(/^password/i).type('test');
    cy.findByLabelText(/confirm password/i).type('test');
    cy.findByRole('button', { name: /submit/i }).click();

    cy.wait('@signup');

    cy.findByText(/Account was successfully created/i).should('be.visible');
  });
});

describe("Flash", () => {
  beforeEach(() => {
    cy.server();
  });

  describe("Sample", () => {
    it("renders an app on screen", () => {
      cy.visit("/")
        .withConfig({}) // withConfig is needed in order for initPlayer to trigger
        .get("#root")
        .children()
        .should("have.length.of.at.least", 1);
    });
  });
});

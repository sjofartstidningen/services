import * as Mjml from '../mjml';

it('should render the mjml string and return an object with an html key', () => {
  const result = Mjml.render(
    `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `,
    {},
  );

  expect(result).toHaveProperty('html', expect.any(String));
});

it('should provide errors if there are any', () => {
  const result = Mjml.render(
    `
  <mlmj> <!-- NOTICE THE MALFORMED SPELLING -->
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mlmj>
  `,
    {},
  );

  expect(result.errors.length).toBeGreaterThan(0);
});

it('should minify output if minify is true in user config', () => {
  const result = Mjml.render(
    `
  <mlmj>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mlmj>
  `,
    { minify: true },
  );

  expect(result.html).toMatchSnapshot();
});

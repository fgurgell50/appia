// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-br">
        <Head>
          {/* Link para a fonte Roboto */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" 
            rel="stylesheet" 
          />
          {/* Link para a fonte DM Sans */}
          <link 
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700&display=swap" 
            rel="stylesheet" 
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

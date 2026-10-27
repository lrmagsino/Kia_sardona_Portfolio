# Kia Sardona — Civil Engineering Portfolio

## Local development

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create a Web3Forms access key at [web3forms.com](https://web3forms.com/) and verify the destination email address with Web3Forms.
3. Copy `.env.example` to `.env.local` and replace the placeholder:

   ```env
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
   ```

   The `NEXT_PUBLIC_` key is included in client-side form requests by design. Use the site-specific access key issued for Web3Forms; do not put passwords, private API keys, or other server secrets in this variable. `.env.local` is ignored by Git.
   Restart the development server after adding or changing the key.

4. Start the local site:

   ```sh
   npm run dev
   ```

5. Test the Send Inquiry form with valid details and confirm delivery at the verified destination email.

## Vercel deployment

1. Import the project repository into Vercel.
2. In **Project Settings → Environment Variables**, add:

   - **Name:** `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - **Value:** the Web3Forms access key for this site
   - **Environments:** Development, Preview, and Production

3. Redeploy after adding or changing the variable. Next.js reads `NEXT_PUBLIC_` variables during the build.
4. Test the Send Inquiry form on the live Vercel URL: submit a valid test inquiry, confirm the success message, and verify that the email arrives. Also confirm required-field and invalid-email messages work.

Do not commit `.env.local` or any real access key to GitHub. Keep `.env.example` as the placeholder-only setup reference.

## Validation commands

```sh
npm run lint
npm run typecheck
npm run build
```

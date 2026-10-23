# Prinky Print: deploy on Vercel with online admin

Designs are now added and deleted by the admin directly on the website. Nobody has to edit or upload JSON files.

## One-time setup (about 5 minutes)

1. **Deploy the site** on Vercel (import the GitHub repo, Framework Preset: *Other*, no build command).
2. **Create storage.** In your Vercel project open **Storage** > **Create** > **Blob**.
   - Choose **Public** access when asked.
   - Connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Set the admin password.** Project > **Settings** > **Environment Variables** > add
   - Name: `ADMIN_PASSWORD`
   - Value: the password you will give the admin (use something strong, 10+ characters)
   - Environments: Production (and Preview if you use it)
4. **Redeploy** (Deployments > the latest one > Redeploy) so the new variables are picked up.

## First login (move the existing designs online, once)

1. Open `/blouse-designer.html`, click **Switch to Seller**, enter the password.
2. Click **Move 60 existing designs online** and keep the page open until it says Done.
3. The tote bag and t-shirt pages start empty. Just log in and add designs.

## What the admin does day to day

On the Blouse, Tote Bag or T-Shirt page: **Switch to Seller**, enter the password.

- **Add Design:** pick one or many pictures. They go live for every buyer straight away.
- **Delete a design:** tap the red x, then tap it again ("Sure?").
- **T-shirt page only:** add or remove colours, and tick or untick the sizes in stock for each colour. Saved automatically.
- Buyers may need up to a minute, or a page refresh, to see the latest change.

The old `shared-*.json` files stay in the project as a fallback. If the online storage is ever unreachable, the pages show those instead.

## Notes

- Changing the password: change `ADMIN_PASSWORD` in Vercel and redeploy.
- Design pictures are shrunk automatically before upload, so large photos are fine.
- Free Vercel plans include Blob storage, with usage limits that are far above what a few hundred designs need.

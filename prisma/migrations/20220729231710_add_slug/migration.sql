/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "url" ADD COLUMN     "slug" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "url_slug_key" ON "url"("slug");

/*
  Warnings:

  - You are about to drop the column `updated_at` on the `product_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_orders" DROP COLUMN "updated_at";

-- CreateIndex
CREATE INDEX "assigned_members_created_at_idx" ON "assigned_members"("created_at");

-- CreateIndex
CREATE INDEX "commissions_base_updated_at_idx" ON "commissions_base"("updated_at");

-- CreateIndex
CREATE INDEX "customers_created_at_idx" ON "customers"("created_at");

-- CreateIndex
CREATE INDEX "customers_address_description_idx" ON "customers"("address_description");

-- CreateIndex
CREATE INDEX "customers_main_number_idx" ON "customers"("main_number");

-- CreateIndex
CREATE INDEX "customers_name_idx" ON "customers"("name");

-- CreateIndex
CREATE INDEX "members_role_idx" ON "members"("role");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_type_idx" ON "orders"("type");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_show_idx" ON "orders"("show");

-- CreateIndex
CREATE INDEX "payment_fees_paid_at_idx" ON "payment_fees"("paid_at");

-- CreateIndex
CREATE INDEX "payment_fees_status_idx" ON "payment_fees"("status");

-- CreateIndex
CREATE INDEX "payment_fees_amount_idx" ON "payment_fees"("amount");

-- CreateIndex
CREATE INDEX "payment_installments_paidAt_idx" ON "payment_installments"("paidAt");

-- CreateIndex
CREATE INDEX "payment_installments_due_date_idx" ON "payment_installments"("due_date");

-- CreateIndex
CREATE INDEX "payment_installments_status_idx" ON "payment_installments"("status");

-- CreateIndex
CREATE INDEX "payment_installments_amount_idx" ON "payment_installments"("amount");

-- CreateIndex
CREATE INDEX "payments_updated_at_idx" ON "payments"("updated_at");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at");

-- CreateIndex
CREATE INDEX "payments_method_idx" ON "payments"("method");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_amount_idx" ON "payments"("amount");

-- CreateIndex
CREATE INDEX "product_orders_created_at_idx" ON "product_orders"("created_at");

-- CreateIndex
CREATE INDEX "products_updated_at_idx" ON "products"("updated_at");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "single_commissions_created_at_idx" ON "single_commissions"("created_at");

-- CreateIndex
CREATE INDEX "single_commissions_flag_idx" ON "single_commissions"("flag");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

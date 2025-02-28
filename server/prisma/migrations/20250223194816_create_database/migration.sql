-- CreateTable
CREATE TABLE "USERS" (
    "id" TEXT NOT NULL,
    "codusu" SERIAL,
    "name" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role_id" TEXT NOT NULL,
    "permission_user_id" TEXT,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROLES" (
    "id" TEXT NOT NULL,
    "codrol" SERIAL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,

    CONSTRAINT "ROLES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "INGREDIENTS" (
    "id" TEXT NOT NULL,
    "coding" SERIAL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "priceUnit" TEXT,
    "priceTotal" TEXT,
    "qtdEst" TEXT,
    "description" TEXT,
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,

    CONSTRAINT "INGREDIENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCTS" (
    "id" TEXT NOT NULL,
    "codpro" SERIAL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "PRODUCTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GROUPS" (
    "id" TEXT NOT NULL,
    "codgru" SERIAL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,

    CONSTRAINT "GROUPS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCT_INGREDIENTS" (
    "id" TEXT NOT NULL,
    "codpin" SERIAL,
    "product_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "qtdProd" TEXT,

    CONSTRAINT "PRODUCT_INGREDIENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MOVIMENTS" (
    "id" TEXT NOT NULL,
    "codmov" SERIAL,
    "type" BOOLEAN,
    "qtdEst" TEXT,
    "priceUnit" TEXT,
    "priceTotal" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_user" TEXT,
    "updated_user" TEXT,
    "ingredient_id" TEXT NOT NULL,

    CONSTRAINT "MOVIMENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUESTS" (
    "id" TEXT NOT NULL,
    "codreq" SERIAL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT NOT NULL,

    CONSTRAINT "REQUESTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUESTS_ITEMS" (
    "id" TEXT NOT NULL,
    "codreqite" SERIAL,
    "qtdEst" TEXT NOT NULL,
    "priceUnit" TEXT NOT NULL,
    "priceTotal" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingredient_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,

    CONSTRAINT "REQUESTS_ITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RETURN_REQUESTS" (
    "id" TEXT NOT NULL,
    "codretreq" SERIAL,
    "qtdEst" TEXT NOT NULL,
    "created_user" TEXT,
    "priceTotal" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_id" TEXT NOT NULL,
    "request_codreq" INTEGER NOT NULL,

    CONSTRAINT "RETURN_REQUESTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SALES" (
    "id" TEXT NOT NULL,
    "codsal" SERIAL,
    "qtd" INTEGER NOT NULL,
    "price" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "SALES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_codusu_key" ON "USERS"("codusu");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_user_key" ON "USERS"("user");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ROLES_codrol_key" ON "ROLES"("codrol");

-- CreateIndex
CREATE UNIQUE INDEX "ROLES_name_key" ON "ROLES"("name");

-- CreateIndex
CREATE UNIQUE INDEX "INGREDIENTS_coding_key" ON "INGREDIENTS"("coding");

-- CreateIndex
CREATE UNIQUE INDEX "INGREDIENTS_name_key" ON "INGREDIENTS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PRODUCTS_codpro_key" ON "PRODUCTS"("codpro");

-- CreateIndex
CREATE UNIQUE INDEX "PRODUCTS_name_key" ON "PRODUCTS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GROUPS_codgru_key" ON "GROUPS"("codgru");

-- CreateIndex
CREATE UNIQUE INDEX "GROUPS_name_key" ON "GROUPS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PRODUCT_INGREDIENTS_codpin_key" ON "PRODUCT_INGREDIENTS"("codpin");

-- CreateIndex
CREATE UNIQUE INDEX "MOVIMENTS_codmov_key" ON "MOVIMENTS"("codmov");

-- CreateIndex
CREATE UNIQUE INDEX "REQUESTS_codreq_key" ON "REQUESTS"("codreq");

-- CreateIndex
CREATE UNIQUE INDEX "REQUESTS_ITEMS_codreqite_key" ON "REQUESTS_ITEMS"("codreqite");

-- CreateIndex
CREATE UNIQUE INDEX "RETURN_REQUESTS_codretreq_key" ON "RETURN_REQUESTS"("codretreq");

-- CreateIndex
CREATE UNIQUE INDEX "SALES_codsal_key" ON "SALES"("codsal");

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "ROLES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_permission_user_id_fkey" FOREIGN KEY ("permission_user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PRODUCTS" ADD CONSTRAINT "PRODUCTS_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GROUPS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCT_INGREDIENTS" ADD CONSTRAINT "PRODUCT_INGREDIENTS_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCT_INGREDIENTS" ADD CONSTRAINT "PRODUCT_INGREDIENTS_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "INGREDIENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MOVIMENTS" ADD CONSTRAINT "MOVIMENTS_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "INGREDIENTS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUESTS_ITEMS" ADD CONSTRAINT "REQUESTS_ITEMS_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "INGREDIENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUESTS_ITEMS" ADD CONSTRAINT "REQUESTS_ITEMS_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "REQUESTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "REQUESTS_ITEMS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_request_codreq_fkey" FOREIGN KEY ("request_codreq") REFERENCES "REQUESTS"("codreq") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALES" ADD CONSTRAINT "SALES_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

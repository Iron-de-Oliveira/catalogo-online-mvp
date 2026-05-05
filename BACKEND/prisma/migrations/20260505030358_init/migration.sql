-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('COZINHA', 'SALA', 'QUARTO', 'MESAS', 'GUARDA_ROUPAS', 'PECAS', 'RUSTICO');

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id_administrador" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id_administrador")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id_produto" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "estoque" INTEGER NOT NULL,
    "descricao" VARCHAR(500),
    "foto" VARCHAR(500) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_administrador" INTEGER NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id_produto")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "administradores_cpf_key" ON "administradores"("cpf");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_id_administrador_fkey" FOREIGN KEY ("id_administrador") REFERENCES "administradores"("id_administrador") ON DELETE RESTRICT ON UPDATE CASCADE;

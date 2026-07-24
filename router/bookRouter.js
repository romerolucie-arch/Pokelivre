import { prisma } from "../db.js";
import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import upload from "../middleware/upload.js";

const bookRouter = Router();

bookRouter.get("/addbook", authGuard, async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      userId: req.session.userId,
    },
  });

  res.render("pages/addbook.twig", {
    userLogged: req.userLogged,
    users,
  });
});

bookRouter.post(
  "/addbook",
  authGuard,
  upload.single("image"),
  async (req, res) => {
    try {
      await prisma.book.create({
        data: {
          titre: req.body.titre,
          userId: req.session.userId,
        },
      });

      res.redirect("/dashboard");
    } catch (error) {
      res.send(error.message);
    }
  }
);

bookRouter.get("/deletebook/:id", authGuard, async (req, res) => {
  await prisma.book.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  res.redirect("/dashboard");
});

bookRouter.get("/updatebook/:id", authGuard, async (req, res) => {
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      user: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      userId: req.session.userId,
    },
  });

  res.render("pages/updatebook.twig", {
    book,
    users,
    userLogged: req.userLogged,
  });
});

bookRouter.post(
  "/updatebook/:id",
  authGuard,
  upload.single("image"),
  async (req, res) => {
    try {
      await prisma.book.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          titre: req.body.titre,
          userId: parseInt(req.body.userId),
        },
      });

      res.redirect("/dashboard");
    } catch (error) {
      res.send(error.message);
    }
  }
);

export default bookRouter;
const knex = require("../database/knex")
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body

    try {
      const checkUserExists = await knex("users").where({ email }).first()

      if (checkUserExists) {
        return response.status(400).json({ error: "E-mail já cadastrado." })
      }

      const hashedPassword = await hash(password, 8)

      const [id] = await knex("users").insert({
        name,
        email,
        password: hashedPassword,
        avatar,
      })

      return response
        .status(201)
        .json({ message: "Usuário inserido com sucesso!" })
    } catch (error) {
      return response.status(500).json({ error: "Erro interno do servidor." })
    }
  }
  
  async update(request, response) {
    const { name, email, password, old_password } = request.body;

    const user_id = request.user.id;

    // Get the user by ID
    const user = await knex('users').where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    // Check if email is already in use by another user
    const userWithUpdatedEmail = await knex('users').where({ email: email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.", 400);
    }

    const updatedData = {
      name: name ?? user.name,
      email: email ?? user.email,
      updated_at: knex.fn.now()
    };

    
    if (password && !old_password) {
      throw new AppError("Informe a antiga senha.", 400);
    }

    if (!password && old_password) {
      throw new AppError("Informe a nova senha.", 400);
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.", 400);
      }

      updatedData.password = await hash(password, 8);
    }

    await knex('users')
      .where({ id: user_id })
      .update(updatedData);

    return response.json();
  }

}

module.exports = UsersController

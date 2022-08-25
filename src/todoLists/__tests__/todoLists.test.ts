import supertest from 'supertest';
import { app } from '../../app';
import {
  createTodoList,
  createTodoListWithTodos,
  createUser,
} from '../../../test-utils';

const basePath = '/todoLists';

describe(`GET ${basePath}?userId=user.id`, () => {
  it('should return 200 with a list of todoLists for a given user', async () => {
    const { id: userId, email: userEmail } = await createUser();

    const { id: todoListId, name: todoListName } = await createTodoList(
      userEmail
    );

    const getByUserIdResponse = await supertest(app)
      .get(`${basePath}/?userId=${userId}`)
      .expect(200);

    const { id, name, todos, users } = getByUserIdResponse.body[0];
    expect(id).toEqual(todoListId);
    expect(name).toEqual(todoListName);
    expect(userId).toEqual(users[0].id);
    expect(userEmail).toEqual(users[0].email);
    expect(todos).toHaveLength(0);
  });

  it('should return 400 when no user id is passed', async () => {
    const getByUserIdResponse = await supertest(app)
      .get(`${basePath}`)
      .expect(400);

    expect(getByUserIdResponse.text).toEqual('"userId" is required');
  });

  it('should return 400 when userId query param is empty', async () => {
    const getByUserIdResponse = await supertest(app)
      .get(`${basePath}/?userId=`)
      .expect(400);

    expect(getByUserIdResponse.text).toEqual(
      '"userId" is not allowed to be empty'
    );
  });

  it('should return 404 when userId query param is bad', async () => {
    const getByUserIdResponse = await supertest(app)
      .get(`${basePath}/?userId=404`)
      .expect(404);

    expect(getByUserIdResponse.text).toEqual('No User found');
  });
});

describe(`POST ${basePath}`, () => {
  it('should return 201 with a newly created todoList', async () => {
    const { id: userId } = await createUser();

    const createTodoListResponse = await supertest(app)
      .post(basePath)
      .send({ userId })
      .expect(201);

    const { name, todos, users } = createTodoListResponse.body;
    expect(name).toEqual('New TodoList');
    expect(todos).toEqual([]);
    expect(users).toHaveLength(1);
  });

  it('should return 400 when request body is missing', async () => {
    const createResponse = await supertest(app)
      .post(basePath)
      .send({})
      .expect(400);

    expect(createResponse.text).toEqual('"userId" is required');
  });
});

describe(`GET ${basePath}/:id`, () => {
  it('should return 200 with a single todoList', async () => {
    const {
      id: todoListId,
      name,
      todos,
      users,
    } = await createTodoListWithTodos();

    const { body: getResponseBody } = await supertest(app)
      .get(`${basePath}/${todoListId}`)
      .expect(200);

    expect(getResponseBody.id).toEqual(todoListId);
    expect(getResponseBody.name).toEqual(name);
    expect(getResponseBody.todos).toHaveLength(todos.length);
    expect(getResponseBody.users).toHaveLength(users.length);
  });

  it('should return 404 when passed an id for a todoList that does not exist', async () => {
    const getResponse = await supertest(app)
      .get(`${basePath}/12345`)
      .expect(404);

    expect(getResponse.text).toEqual('No TodoList found');
  });
});

describe(`PUT ${basePath}/:id`, () => {
  it('should return 200 with an updated todoList', async () => {
    const { id: todoListId, todos, users } = await createTodoListWithTodos();

    const updatedName = 'Updated TodoList name';

    const { body: updateResponseBody } = await supertest(app)
      .put(`${basePath}/${todoListId}`)
      .send({ name: updatedName })
      .expect(200);

    expect(updateResponseBody.id).toEqual(todoListId);
    expect(updateResponseBody.name).toEqual(updatedName);
    expect(updateResponseBody.todos).toHaveLength(todos.length);
    expect(updateResponseBody.users).toHaveLength(users.length);
  });

  it('should return 400 when request body is missing', async () => {
    const { id: todoListId } = await createTodoListWithTodos();

    const updateResponse = await supertest(app)
      .put(`${basePath}/${todoListId}`)
      .expect(400);

    expect(updateResponse.text).toEqual(
      'Must provide at least one property to update.'
    );
  });

  it('should return 404 on attempt to update a todoList that does not exist', async () => {
    const updateResponse = await supertest(app)
      .put(`${basePath}/12345`)
      .send({ name: 'TodoList does not exist' })
      .expect(404);

    expect(updateResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to update not found.'
    );
  });
});

describe(`DELETE ${basePath}/:id`, () => {
  it('should delete a todoList and return 204', async () => {
    const { id: todoListId } = await createTodoList();
    const deleteResponse = await supertest(app)
      .delete(`${basePath}/${todoListId}`)
      .expect(204);

    expect(deleteResponse.body).toEqual({});
    expect(deleteResponse.text).toEqual('');
  });

  it('should return 404 on attempt to delete a todoList that does not exist', async () => {
    const deleteResponse = await supertest(app)
      .delete(`${basePath}/12345`)
      .expect(404);

    expect(deleteResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.'
    );
  });
});

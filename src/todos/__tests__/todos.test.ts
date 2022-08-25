import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { app } from '../../app';
import {
  createTodo,
  createTodoList,
  createTodoListWithTodos,
} from '../../../test-utils';

const basePath = '/todos';

describe(`POST ${basePath}`, () => {
  it('should return 201 with a newly created todo', async () => {
    const { id: listId } = await createTodoList();
    const title = 'Finish the integration tests';

    const { body: createResponseBody } = await supertest(app)
      .post(basePath)
      .send({ listId, title })
      .expect(201);

    expect(createResponseBody.isComplete).toBe(false);
    expect(createResponseBody.listId).toEqual(listId);
    expect(createResponseBody.title).toEqual(title);
  });

  it('should return 404 on attempt to create a todo for a todoList that does not exist', async () => {
    const todoTitle = 'Imporove error messages';

    const createTodoResponse = await supertest(app)
      .post(basePath)
      .send({ title: todoTitle, listId: uuid() })
      .expect(404);

    expect(createTodoResponse.text).toEqual(
      'Foreign key constraint failed on the field: `todos_listId_fkey (index)`'
    );
  });

  it('should return 400 when request body is missing', async () => {
    const createTodoResponse = await supertest(app).post(basePath).expect(400);

    expect(createTodoResponse.text).toEqual(
      '"listId" is required,"title" is required'
    );
  });
});

describe(`GET ${basePath}/?listId=todoList.id`, () => {
  it('should return 200 with a list of todos for a given listId', async () => {
    const { id: listId } = await createTodoListWithTodos();

    const getTodosResponse = await supertest(app)
      .get(`${basePath}/?listId=${listId}`)
      .expect(200);

    expect(getTodosResponse.body).toHaveLength(2);
  });

  it('should return 400 when listId is empty', async () => {
    const getTodosResponse = await supertest(app)
      .get(`${basePath}/?listId=`)
      .expect(400);

    expect(getTodosResponse.text).toEqual(
      '"listId" is not allowed to be empty'
    );
  });

  it('should return 400 when listId query param is missing', async () => {
    const getTodosResponse = await supertest(app)
      .get(`${basePath}`)
      .expect(400);

    expect(getTodosResponse.text).toEqual('"listId" is required');
  });

  it('should return 404 when listId query param is bad', async () => {
    const getTodosResponse = await supertest(app)
      .get(`${basePath}/?listId=404`)
      .expect(404);

    expect(getTodosResponse.text).toEqual('No TodoList found');
  });
});

describe(`PUT ${basePath}/:id`, () => {
  it('should return 200 with an updated todo', async () => {
    const { id: listId } = await createTodoList();

    const { id: todoId } = await createTodo(listId, {
      title: 'Finish the integration tests',
    });

    const updatedTitle = 'Refactor data models';

    const { body: updateResponseBody } = await supertest(app)
      .put(`${basePath}/${todoId}`)
      .send({ isComplete: true, title: updatedTitle })
      .expect(200);

    expect(updateResponseBody.id).toEqual(todoId);
    expect(updateResponseBody.isComplete).toEqual(true);
    expect(updateResponseBody.listId).toEqual(listId);
    expect(updateResponseBody.title).toEqual(updatedTitle);
  });

  it('should return 404 on attempt to update a todo that does not exist', async () => {
    const updateTodoResponse = await supertest(app)
      .put(`${basePath}/12345`)
      .send({ isComplete: true })
      .expect(404);

    expect(updateTodoResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to update not found.'
    );
  });

  it('should return 400 when request body is missing', async () => {
    const { id: listId } = await createTodoList();

    const { id: todoId } = await createTodo(listId, {
      title: 'Fix the beforeEach()',
    });

    const updateTodoResponse = await supertest(app)
      .put(`${basePath}/${todoId}`)
      .expect(400);

    expect(updateTodoResponse.text).toEqual(
      'Must provide at least one property to update.'
    );
  });
});

describe(`DELETE ${basePath}/:id`, () => {
  it('should delete a todo and return 204', async () => {
    const { id: listId } = await createTodoList();

    const { id: todoId } = await createTodo(listId, {
      title: 'Fix the beforeEach()',
    });

    const deleteResponse = await supertest(app)
      .delete(`${basePath}/${todoId}`)
      .expect(204);

    expect(deleteResponse.body).toEqual({});
    expect(deleteResponse.text).toEqual('');
  });

  it('should return 404 on attempt to delete a todo that does not exist', async () => {
    const deleteTodoResponse = await supertest(app)
      .delete(`${basePath}/12345`)
      .expect(404);

    expect(deleteTodoResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.'
    );
  });
});

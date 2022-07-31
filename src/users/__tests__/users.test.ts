import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import { app } from '../../app';
import { createUser } from '../../../test-utils';

const basePath = '/users';

describe(`POST ${basePath}`, () => {
  it('should return 201 with a newly created user', async () => {
    const email = `${uuid()}@test.com`;
    const { body: createResponseBody } = await supertest(app)
      .post(basePath)
      .send({ email })
      .expect(201);

    expect(createResponseBody.email).toEqual(email);
  });

  it('should return 400 when request body is missing', async () => {
    const createResponse = await supertest(app)
      .post(basePath)
      .send({})
      .expect(400);

    expect(createResponse.text).toEqual('"email" is required');
  });

  it('should return 409 on attempt to create with an email that already exists for another user', async () => {
    const { email } = await createUser();

    const createResponse = await supertest(app)
      .post(basePath)
      .send({ email })
      .expect(409);

    expect(createResponse.text).toEqual(
      'Unique constraint failed on the fields: (`email`)'
    );
  });
});

describe(`GET ${basePath}/?email=user.email`, () => {
  it('should return 200 with a single user', async () => {
    const { id, email } = await createUser();

    const { body: getResponseBody } = await supertest(app)
      .get(`${basePath}/?email=${email}`)
      .expect(200);

    expect(getResponseBody.id).toEqual(id);
    expect(getResponseBody.email).toEqual(email);
  });

  it('should return 404 when passed an email for a user that does not exist', async () => {
    const getResponse = await supertest(app)
      .get(`${basePath}/?email=tony.stank@stank.industries.com`)
      .expect(404);

    expect(getResponse.text).toEqual('No User found');
  });

  it('should return 400 when passed an invalid email', async () => {
    const getResponse = await supertest(app)
      .get(`${basePath}/?email=not.an.email.address`)
      .expect(400);

    expect(getResponse.text).toEqual('"email" must be a valid email');
  });

  it('should return 400 when email is empty', async () => {
    const getResponse = await supertest(app)
      .get(`${basePath}/?email=`)
      .expect(400);

    expect(getResponse.text).toEqual('"email" is not allowed to be empty');
  });
});

describe(`PUT ${basePath}/:id`, () => {
  it('should return 200 with an updated user', async () => {
    const { id: userId } = await createUser();
    const updatedEmail = 'tony.stank@stank.industries.com';

    const { body: updateResponseBody } = await supertest(app)
      .put(`${basePath}/${userId}`)
      .send({ email: updatedEmail })
      .expect(200);

    expect(updateResponseBody.id).toEqual(userId);
    expect(updateResponseBody.email).toEqual(updatedEmail);
  });

  it('should return 400 when the request body is missing', async () => {
    const { id: userId } = await createUser();
    const updateResponse = await supertest(app)
      .put(`${basePath}/${userId}`)
      .expect(400);

    expect(updateResponse.text).toEqual(
      'Must provide at least one property to update.'
    );
  });

  it('should return 404 on attempt to update a user that does not exist', async () => {
    const updateResponse = await supertest(app)
      .put(`${basePath}/12345`)
      .send({ email: `${uuid()}@test.com` })
      .expect(404);

    expect(updateResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to update not found.'
    );
  });

  it('should return 409 on attempt to update with an email address that is already in use', async () => {
    const { email: existingEmail } = await createUser();
    const { id: userId } = await createUser();

    const updateResponse = await supertest(app)
      .put(`${basePath}/${userId}`)
      .send({ email: existingEmail })
      .expect(409);

    expect(updateResponse.text).toEqual(
      'Unique constraint failed on the fields: (`email`)'
    );
  });
});

describe(`DELETE ${basePath}/:id`, () => {
  it('should delete a user and return 204', async () => {
    const { id: userId } = await createUser();

    const deleteResponse = await supertest(app)
      .delete(`${basePath}/${userId}`)
      .expect(204);

    expect(deleteResponse.body).toEqual({});
    expect(deleteResponse.text).toEqual('');
  });

  it('should return 404 on attempt to delete a user that does not exist', async () => {
    const deleteResponse = await supertest(app)
      .delete(`${basePath}/12345`)
      .expect(404);

    expect(deleteResponse.text).toEqual(
      'An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.'
    );
  });
});

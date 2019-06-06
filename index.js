const app = require('../app');

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;


const api = supertest('http://localhost:3000');

let login = null;
let users = null;

describe('Tests', () => {

	// Login user to the system and fetch access token
	it('Login user', (done) => {
		api.post('/sign-in')
			.send({
				password: 'password',
				email: 'email',
			})
			.then((res) => {
				login = res.body.access_token;
				done();
			}).
			catch(done);
	});
	
	it('Get users list', (done) => {
        api.get('/users')
            .set('authorization', login)
            .then((res) => {
                // we expect that there is 6 users. You can check/confirm that in app code.
				users = res.body;
				expect(200);
                expect(users.length).to.be.equal(6);
                done();
            }).
        catch(done);
    });

	
	//Try to login with invalid email and invalid password
	it('Invalid username and invalid password', (done) => {
		api.post('/sign-in')
			.send({
				password: 'wrong_password',
				email: 'wrong_email',
			})
			.then((res) => {
				expect(404);
				expect(res.body.message).to.equal('Wrong password or email');
				done();
			}).
			catch(done);
	});
	
	//Try to login with invalid email and valid password
	it('Invalid username and valid password', (done) => {
		api.post('/sign-in')
			.send({
				password: 'password',
				email: 'wrong_email',
			})
			.then((res) => {
				expect(404);
				expect(res.body.message).to.equal('Wrong password or email');
				done();
			}).
			catch(done);
	});
	
	//Try to login with valid email and invalid password
	it('Valid username and invalid password', (done) => {
		api.post('/sign-in')
			.send({
				password: 'invalid_password',
				email: 'email',
			})
			.then((res) => {
				expect(404);
				expect(res.body.message).to.equal('Wrong password or email');
				done();
			}).
			catch(done);
	});
	
	//Get single user data
	
	it('Get single user data ', (done) => {
        api.get('/users/3')
            .set('authorization', login)
            .then((res) => {
				expect(200);
                		expect(res.body.name).to.be.equal("User The Three");
				expect(res.body.user_id).to.be.equal(3);
				expect(res.body.title).to.be.equal("Salata master");
				expect(res.body.active).to.be.equal(false);
                done();
            }).
        catch(done);
    });
	
	//Try to get data for non-existent user
	
	it('Get single user data ', (done) => {
        api.get('/users/7')
            .set('authorization', login)
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
		expect(res.body.message).to.be.equal("Cannot read property 'status' of undefined");
                done();
            }).
        catch(done);
    });
	
	//Get user accounts

    it('Get single user account ', (done) => {
        api.get('/users/1/accounts')
            .set('authorization', login)
            .then((res) => {
				expect(200);
                		expect(res.body[0].name).to.be.equal("Wife's account");
				expect(res.body[0].account_id).to.be.equal(1);
				expect(res.body[0].money).to.be.equal(100);
				expect(res.body[0].active).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    
	//Try to get accounts for user that doesn't have accounts
	it('Get single user data ', (done) => {
        api.get('/users/6/accounts')
            .set('authorization', login)
            .then((res) => {
				expect(200);
                		expect(res.body.message).to.be.equal("Time lords do not have accounts");
                		done();
            }).
        catch(done);
    });

		
	
});

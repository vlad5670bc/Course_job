import Account from './AccountsScheme.js'

class AccountsService{
    async createAccount(name,surname,lastname,password,userRole){
        const newAccount = await Account.create({name,surname,lastname,password,userRole})
        return newAccount
    }
    async validate(account){
        console.log(account)
        if(!account){
            throw new Error ('Login or password wrong')
        }
        const post = await Account.findOne(account)
        return post
    }

async getUserRole(name, surname, lastname) {
    console.log(`Querying MongoDB with: name=${name}, surname=${surname}, lastname=${lastname}`);

    try {
        // Perform the query using Mongoose
        return await Account.findOne({
            name: name,
            surname: surname,
            lastname: lastname
        });
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

}

export default new AccountsService()
import AccountsService from './AccountsService.js';

class AccountsController {
    async login(req, res) {
        try {
            res.status(200).json({ title: "Login Page" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Validate login and send a JSON response
    async loginValidate(req, res) {
        try {
            const user = await AccountsService.validate(req.body);

            if (user) {
                // Store isAdmin status in session
                req.session.userRole = user.userRole; // Ensure boolean value
                console.log('User role:', req.session.userRole);

                // Send success response to the client
                res.status(200).json({ message: "Login successful", redirect: '/api/collections', userRole: req.session.userRole });
            } else {
                // Send error response to React frontend for incorrect login
                res.status(400).json({ error: "Can't find account" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Register logic without rendering (React will handle the frontend)
    async register(req, res) {
        try {
            res.status(200).json({ title: "Register Page" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Create account and respond with JSON
    async createAccount(req, res) {
        try {
            // Create new account using service
            await AccountsService.createAccount(req.body.name,req.body.surname, req.body.lastname,req.body.password, req.body.userRole);

            // Respond with JSON, or provide a redirect URL
            res.status(200).json({ message: "Account created", redirect: '/api/login' });
        } catch (e) {
            res.status(500).json({ error: "Create account error: " + e.message });
        }
    }
    async getUserRole(req, res) {
    const { name, surname, lastname } = req.query;
    console.log(`Received query: name=${name}, surname=${surname}, lastname=${lastname}`);

    try {
        const user = await AccountsService.getUserRole(name, surname, lastname);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Send the userRole field instead of role
        res.send({ role: user.userRole });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).send({ error: 'Server error' });
    }
}


}

export default new AccountsController();

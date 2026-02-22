// Supabase User Data Management Script
// Initialize Supabase with your credentials
const { createClient } = supabase;
const supabase = createClient(
    'https://kvydgqwpzowhmzjzsmpi.supabase.co',
    'sb_publishable_i7aw3LIiaJotv_2FS3Ip1w_sxYi7L4Q'
);

// User Registration
async function registerUser(email, password, username) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    role: 'user',
                    created_at: new Date().toISOString()
                }
            }
        });
        
        if (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Registration successful:', data);
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Registration exception:', error);
        return { success: false, error: error.message };
    }
}

// User Login
async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Login successful:', data);
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login exception:', error);
        return { success: false, error: error.message };
    }
}

// User Logout
async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Logout successful');
        return { success: true };
    } catch (error) {
        console.error('Logout exception:', error);
        return { success: false, error: error.message };
    }
}

// Get Current User
async function getCurrentUser() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Get session error:', error);
            return null;
        }
        
        return session?.user || null;
    } catch (error) {
        console.error('Get user exception:', error);
        return null;
    }
}

// Update User Profile
async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);
        
        if (error) {
            console.error('Profile update error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Profile updated:', data);
        return { success: true, data: data };
    } catch (error) {
        console.error('Profile update exception:', error);
        return { success: false, error: error.message };
    }
}

// Check if Email Exists
async function checkEmailExists(email) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email)
            .single();
        
        if (error) {
            console.error('Email check error:', error);
            return false;
        }
        
        return data ? true : false;
    } catch (error) {
        console.error('Email check exception:', error);
        return false;
    }
}

// Check if Username Exists
async function checkUsernameExists(username) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();
        
        if (error) {
            console.error('Username check error:', error);
            return false;
        }
        
        return data ? true : false;
    } catch (error) {
        console.error('Username check exception:', error);
        return false;
    }
}

// Password Reset Request
async function requestPasswordReset(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Password reset email sent:', data);
        return { success: true, data: data };
    } catch (error) {
        console.error('Password reset exception:', error);
        return { success: false, error: error.message };
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        supabase,
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        updateUserProfile,
        checkEmailExists,
        checkUsernameExists,
        requestPasswordReset
    };
}

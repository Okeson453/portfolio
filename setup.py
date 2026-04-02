import os

# Base directory (assuming root of workspace)
base_dir = '.'

# List of directories
directories = [
    'app/(auth)',
    'app/(auth)/login',
    'app/(auth)/login/two-factor',
    'app/(auth)/login/biometric',
    'app/(auth)/register',
    'app/(auth)/register/security-assessment',
    'app/(auth)/recovery',
    'app/(auth)/recovery/security-questions',
    'components/auth'
]

# List of files with paths relative to base_dir and their comments
files = [
    ('app/(auth)/layout.tsx', '# Shared auth layout (centered card, background)'),
    ('app/(auth)/login/page.tsx', '# Main login form'),
    ('app/(auth)/login/two-factor/page.tsx', '# 2FA code verification'),
    ('app/(auth)/login/biometric/page.tsx', '# WebAuthn / biometric login'),
    ('app/(auth)/register/page.tsx', '# Registration form (with security check toggle)'),
    ('app/(auth)/register/security-assessment/page.tsx', '# Optional security knowledge quiz'),
    ('app/(auth)/recovery/page.tsx', '# Request account recovery (email)'),
    ('app/(auth)/recovery/security-questions/page.tsx', '# Answer pre-set security questions'),  # Changed to regular hyphen
    
    ('components/auth/LoginForm.tsx', ''),
    ('components/auth/RegisterForm.tsx', ''),
    ('components/auth/TwoFactorForm.tsx', ''),
    ('components/auth/BiometricPrompt.tsx', ''),
    ('components/auth/SecurityAssessmentForm.tsx', ''),
    ('components/auth/SecurityQuestionsForm.tsx', ''),
    ('components/auth/RecoveryRequestForm.tsx', '')
]

# Create directories
for dir_path in directories:
    os.makedirs(os.path.join(base_dir, dir_path), exist_ok=True)

# Create files
for file_path, comment in files:
    full_path = os.path.join(base_dir, file_path)
    with open(full_path, 'w', encoding='utf-8') as f:  # Added encoding='utf-8' to handle Unicode characters
        if comment:
            f.write(f'// {comment}\n')
        # Else, empty file

print("Additional directory structure created successfully!")
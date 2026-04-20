/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const srcReact = 'd:/NewNader/Foody/foodyreact/src/app/components';
const destFeatures = 'd:/NewNader/Foody/foodynextjs/src/features';
const destShared = 'd:/NewNader/Foody/foodynextjs/src/components/shared';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(destFeatures);
ensureDir(destShared);

const files = fs.readdirSync(srcReact, { withFileTypes: true });

files.forEach(file => {
  if (file.isDirectory()) {
    if (file.name === 'figma') {
      ensureDir(path.join(destShared, 'figma'));
      const figmaFiles = fs.readdirSync(path.join(srcReact, 'figma'));
      figmaFiles.forEach(ff => {
        let content = fs.readFileSync(path.join(srcReact, 'figma', ff), 'utf8');
        fs.writeFileSync(path.join(destShared, 'figma', ff), content);
      });
    }
    return;
  }
  
  if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
    let content = fs.readFileSync(path.join(srcReact, file.name), 'utf8');
    
    // Replace React Router Link with Next.js Link
    content = content.replace(/import \{.*?Link.*?\} from ['"]react-router-dom['"];?/g, "import Link from 'next/link';");
    content = content.replace(/import \{.*?Link.*?\} from ['"]react-router['"];?/g, "import Link from 'next/link';");
    content = content.replace(/<Link([^>]*)to=/g, "<Link$1href=");
    
    // Replace useNavigate with useRouter
    content = content.replace(/useNavigate/g, "useRouter");
    content = content.replace(/import \{.*?useRouter.*?\} from ['"]react-router['"];?/g, "import { useRouter } from 'next/navigation';");
    content = content.replace(/import \{.*?(?<!useRouter.*?)useRouter.*?\} from ['"]react-router['"];?/g, ""); // strip duplicate
    if (content.includes('useRouter(') && !content.includes('next/navigation')) {
        content = "import { useRouter } from 'next/navigation';\n" + content;
    }
    content = content.replace(/import \{.*?\} from ['"]react-router['"];?/g, ""); // remove empty react-router imports

    // Fix UI imports
    content = content.replace(/from ['"]\.\/ui\/(.*?)['"]/g, "from '@/components/ui/$1'");
    // Fix shared imports (FoodyLogo, etc.)
    content = content.replace(/from ['"]\.\/(FoodyLogo|role-selector)['"]/g, "from '@/components/shared/$1'");
    // Fix figma imports
    content = content.replace(/from ['"]\.\/figma\/(.*?)['"]/g, "from '@/components/shared/figma/$1'");

    let destDir = destFeatures;
    if (file.name.startsWith('auth-')) destDir = path.join(destFeatures, 'auth');
    else if (file.name.startsWith('manager-')) destDir = path.join(destFeatures, 'manager');
    else if (file.name.startsWith('customer-')) destDir = path.join(destFeatures, 'customer');
    else if (file.name.startsWith('charity-')) destDir = path.join(destFeatures, 'charity');
    else if (file.name.startsWith('branch-')) destDir = path.join(destFeatures, 'staff');
    else if (['landing-page.tsx', 'pricing-page.tsx', 'about-page.tsx', 'product-page.tsx', 'solutions-page.tsx'].includes(file.name)) destDir = path.join(destFeatures, 'marketing');
    else {
        destDir = destShared; // FoodyLogo, role-selector
    }

    ensureDir(destDir);
    fs.writeFileSync(path.join(destDir, file.name), content);
  }
});

console.log('Migration of components complete. Now creating app structure.');

// Create app router structure
const appDir = 'd:/NewNader/Foody/foodynextjs/src/app';

// Home
fs.writeFileSync(path.join(appDir, 'page.tsx'), `import { LandingPage } from '@/features/marketing/landing-page';\n\nexport default function Home() {\n  return <LandingPage />;\n}`);

// Auth
ensureDir(path.join(appDir, 'auth'));
fs.writeFileSync(path.join(appDir, 'auth', 'page.tsx'), `import { AuthRoleSelect } from '@/features/auth/auth-role-select';\n\nexport default function AuthPage() {\n  return <AuthRoleSelect />;\n}`);

ensureDir(path.join(appDir, 'login'));
fs.writeFileSync(path.join(appDir, 'login', 'page.tsx'), `import { AuthLogin } from '@/features/auth/auth-login';\n\nexport default function LoginPage() {\n  return <AuthLogin />;\n}`);

ensureDir(path.join(appDir, 'signup'));
fs.writeFileSync(path.join(appDir, 'signup', 'page.tsx'), `import { AuthSignup } from '@/features/auth/auth-signup';\n\nexport default function SignupPage() {\n  return <AuthSignup />;\n}`);

ensureDir(path.join(appDir, 'forgot-password'));
fs.writeFileSync(path.join(appDir, 'forgot-password', 'page.tsx'), `import { AuthForgotPassword } from '@/features/auth/auth-forgot-password';\n\nexport default function ForgotPasswordPage() {\n  return <AuthForgotPassword />;\n}`);

// Manager
ensureDir(path.join(appDir, 'manager'));
fs.writeFileSync(path.join(appDir, 'manager', 'layout.tsx'), `'use client';\nimport { ManagerLayout } from '@/features/manager/manager-layout';\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <ManagerLayout>{children}</ManagerLayout>;\n}`);
fs.writeFileSync(path.join(appDir, 'manager', 'page.tsx'), `import { ManagerOverview } from '@/features/manager/manager-overview';\n\nexport default function Page() {\n  return <ManagerOverview />;\n}`);
['branches', 'staff', 'charities', 'reports', 'profile', 'settings'].forEach(sub => {
    ensureDir(path.join(appDir, 'manager', sub));
    let compExt = sub.charAt(0).toUpperCase() + sub.slice(1);
    fs.writeFileSync(path.join(appDir, 'manager', sub, 'page.tsx'), `import { Manager${compExt} } from '@/features/manager/manager-${sub}';\n\nexport default function Page() {\n  return <Manager${compExt} />;\n}`);
});

// Portals
ensureDir(path.join(appDir, 'staff'));
fs.writeFileSync(path.join(appDir, 'staff', 'page.tsx'), `import { BranchStaff } from '@/features/staff/branch-staff';\n\nexport default function Page() {\n  return <BranchStaff />;\n}`);

ensureDir(path.join(appDir, 'charity'));
fs.writeFileSync(path.join(appDir, 'charity', 'page.tsx'), `import { CharityPortal } from '@/features/charity/charity-portal';\n\nexport default function Page() {\n  return <CharityPortal />;\n}`);

ensureDir(path.join(appDir, 'customer'));
fs.writeFileSync(path.join(appDir, 'customer', 'page.tsx'), `import { CustomerListings } from '@/features/customer/customer-listings';\n\nexport default function Page() {\n  return <CustomerListings />;\n}`);
ensureDir(path.join(appDir, 'customer', 'meal', '[id]'));
fs.writeFileSync(path.join(appDir, 'customer', 'meal', '[id]', 'page.tsx'), `import { CustomerMealDetail } from '@/features/customer/customer-meal-detail';\n\nexport default function Page() {\n  return <CustomerMealDetail />;\n}`);
ensureDir(path.join(appDir, 'customer', 'profile'));
fs.writeFileSync(path.join(appDir, 'customer', 'profile', 'page.tsx'), `import { CustomerProfile } from '@/features/customer/customer-profile';\n\nexport default function Page() {\n  return <CustomerProfile />;\n}`);

// Marketing
['product', 'solutions', 'pricing', 'about'].forEach(page => {
    ensureDir(path.join(appDir, page));
    let compExt = page.charAt(0).toUpperCase() + page.slice(1) + 'Page';
    fs.writeFileSync(path.join(appDir, page, 'page.tsx'), `import { ${compExt} } from '@/features/marketing/${page}-page';\n\nexport default function Page() {\n  return <${compExt} />;\n}`);
});

console.log('App pages generated.');

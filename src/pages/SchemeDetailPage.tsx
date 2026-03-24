import { ArrowLeft, CheckCircle, AlertCircle, FileText, MapPin, Users } from 'lucide-react';

interface SchemeDetail {
  id: string;
  name: string;
  shortName: string;
  steps: Step[];
  documents: string[];
  eligibility: string[];
  whereToApply: string[];
  accountCreation: AccountCreationStep[];
  minimumAmount: string;
  maximumAmount: string;
  penalties: string[];
  importantNotes: string[];
}

interface Step {
  number: number;
  title: string;
  description: string;
  substeps: string[];
}

interface AccountCreationStep {
  number: number;
  title: string;
  details: string[];
}

interface SchemeDetailPageProps {
  schemeId: string;
  onBack: () => void;
}

const schemeDetails: Record<string, SchemeDetail> = {
  '1': {
    id: '1',
    name: 'Public Provident Fund',
    shortName: 'PPF',
    minimumAmount: '₹500',
    maximumAmount: '₹1.5 lakh per financial year',
    steps: [
      {
        number: 1,
        title: 'Gather Required Documents',
        description: 'Collect all necessary documents before visiting the bank or post office',
        substeps: [
          'Aadhaar Card (original + copy)',
          'PAN Card (original + copy)',
          'Address Proof (electricity bill, water bill, or utility bill)',
          'Cancelled cheque or bank statement',
          'Recent passport-sized photograph (2-3 copies)',
          'Income proof (salary slip for employed, ITR for self-employed)',
        ],
      },
      {
        number: 2,
        title: 'Choose Your Financial Institution',
        description: 'Select where you want to open your PPF account',
        substeps: [
          'Government post offices (most accessible)',
          'Nationalized banks (SBI, Bank of Baroda, etc.)',
          'Scheduled commercial banks participating in PPF scheme',
          'Consider location convenience and customer service',
        ],
      },
      {
        number: 3,
        title: 'Fill PPF Application Form',
        description: 'Complete the official PPF account opening form',
        substeps: [
          'Obtain PPF Form A (account opening form)',
          'Fill in personal details accurately',
          'Mention nominee details (person to receive funds if you pass away)',
          'Sign the form in authorized areas',
          'Get the form verified if applying for a minor account',
        ],
      },
      {
        number: 4,
        title: 'Submit Documents and Make Initial Deposit',
        description: 'Submit all documents and make your first investment',
        substeps: [
          'Visit the chosen post office or bank with all documents',
          'Submit the filled application form with documents',
          'Make your initial deposit (minimum ₹500)',
          'Payment can be in cash or cheque',
          'Obtain receipt and keep it safely',
        ],
      },
      {
        number: 5,
        title: 'Receive Passbook and Account Confirmation',
        description: 'Collect your PPF passbook and account details',
        substeps: [
          'Receive PPF passbook immediately or within 5-7 days',
          'Note down your PPF account number',
          'Keep passbook safe (proof of investment)',
          'You can also access through online banking',
          'Set up digital access through official website',
        ],
      },
      {
        number: 6,
        title: 'Make Annual Deposits',
        description: 'Continue investing to maximize returns',
        substeps: [
          'You can make multiple deposits in a financial year (up to ₹1.5 lakh)',
          'Deposits should be made before March 31st',
          'Interest is credited on April 1st each year',
          'Set up standing instructions for automated deposits',
          'Monitor your account through passbook or online portal',
        ],
      },
      {
        number: 7,
        title: 'Track Your Account',
        description: 'Monitor your investment growth regularly',
        substeps: [
          'Check passbook entries after each deposit',
          'Interest is credited annually on April 1st',
          'After 7 years, you can withdraw partially',
          'After 15 years, you can withdraw fully',
          'Online portal shows real-time balance and interest',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Online Account Opening (if available)',
        details: [
          'Visit the official PPF portal or bank website',
          'Click on "Open PPF Account Online"',
          'Fill in personal and financial details',
          'Upload scanned copies of documents',
          'Verify through OTP sent to registered mobile/email',
          'Confirmation will be sent within 3-5 business days',
          'You can then deposit funds online via net banking',
        ],
      },
      {
        number: 2,
        title: 'Offline Account Opening (Traditional Method)',
        details: [
          'Visit nearest post office or bank branch',
          'Collect PPF Form A',
          'Fill form with personal details and nominee information',
          'Attach photocopies of all required documents',
          'Submit along with initial deposit',
          'Get receipt with account number',
          'Passbook issued immediately or within 7 days',
        ],
      },
      {
        number: 3,
        title: 'Account Opening for Minors',
        details: [
          'Parent or legal guardian must apply',
          'Guardian provides their KYC documents',
          'Minor\'s birth certificate and school ID required',
          'Account transferred to minor on 18th birthday',
          'Minor can continue or modify upon adulthood',
          'Interest earned is tax-exempt until transfer',
        ],
      },
    ],
    documents: [
      'Aadhaar Card (primary identity proof)',
      'PAN Card (for tax purposes)',
      'Utility bill or lease agreement (address proof)',
      'Cancelled cheque or bank statement',
      'Passport-sized photographs (3-4 copies)',
      'Income proof (salary slip or ITR)',
      'Birth certificate (if opening for minor)',
      'Guardian ID proof (if opening for minor)',
    ],
    eligibility: [
      'Indian citizen',
      'Age minimum 18 years (or guardian for minors)',
      'Single or joint account allowed',
      'Resident of India (Indian resident individuals)',
      'Can open for minor with parent/guardian consent',
      'NRI cannot directly hold PPF, but can have Hindu Undivided Family account',
    ],
    whereToApply: [
      'Any India Post office across the country',
      'Nationalized banks (SBI, Bank of Baroda, Bank of India, Central Bank)',
      'Select scheduled commercial banks',
      'Some private banks partnering with post office',
    ],
    penalties: [
      'If deposit not made in a financial year: Account suspended but can be revived with ₹50 penalty per year',
      'Late deposit penalty: ₹50 per year for each delayed financial year',
      'Early withdrawal before 7 years: Not allowed',
      'Withdrawal between 7-15 years: Limited to 50% of balance or previous year balance',
    ],
    importantNotes: [
      'PPF is a 15-year scheme, but can be extended for 5-year blocks after maturity',
      'Interest rate is reviewed every quarter and adjusted accordingly',
      'Account can have only one name or joint account (max 2 adults)',
      'Funds are 100% secure backed by Government of India',
      'Loan facility available after 3 years (up to 50% of balance)',
      'Partial withdrawal allowed after 7 years',
      'Tax benefits under Section 80C (up to ₹1.5 lakh)',
      'Interest earned is completely tax-free (Section 10(n))',
      'Charges are nil - zero account maintenance fees',
    ],
  },
  '2': {
    id: '2',
    name: 'Sukanya Samriddhi Yojana',
    shortName: 'SSY',
    minimumAmount: '₹250',
    maximumAmount: '₹1.5 lakh per financial year',
    steps: [
      {
        number: 1,
        title: 'Verify Eligibility',
        description: 'Ensure you meet all SSY requirements',
        substeps: [
          'Girl child must be below 10 years of age',
          'Only 2 accounts allowed per family',
          'Account must be opened by parents/legal guardian',
          'Girl must be Indian resident',
          'Account must be opened before girl turns 10',
        ],
      },
      {
        number: 2,
        title: 'Gather Documents',
        description: 'Collect all necessary documents',
        substeps: [
          'Girl\'s birth certificate (original + copy)',
          'Girl\'s Aadhaar Card (if available)',
          'Parent\'s Aadhaar Card (original + copy)',
          'Parent\'s PAN Card (original + copy)',
          'Address proof (utility bill, lease agreement)',
          'Cancelled cheque or bank statement',
          'Passport-sized photographs (3-4 copies)',
        ],
      },
      {
        number: 3,
        title: 'Visit Post Office or Bank',
        description: 'Go to authorized financial institution',
        substeps: [
          'Visit nearest India Post office',
          'Can also visit participating banks',
          'Government office preferred for faster processing',
          'Choose location convenient for regular deposits',
        ],
      },
      {
        number: 4,
        title: 'Fill SSY Form A',
        description: 'Complete account opening form',
        substeps: [
          'Obtain SSY Form A at post office/bank',
          'Fill in girl\'s full details as per birth certificate',
          'Provide parent/guardian information',
          'Mention contact details for communication',
          'Attach all photocopies to form',
        ],
      },
      {
        number: 5,
        title: 'Make Initial and Subsequent Deposits',
        description: 'Fund your SSY account',
        substeps: [
          'Minimum initial deposit: ₹250',
          'Can deposit multiple times within a financial year',
          'Maximum: ₹1.5 lakh per financial year',
          'Payment via cash, cheque, or online transfer',
          'Deposits must be completed by March 31st',
        ],
      },
      {
        number: 6,
        title: 'Receive Passbook and Account Certificate',
        description: 'Collect official documents',
        substeps: [
          'SSY passbook issued immediately',
          'Account certificate provided with account number',
          'Account number format: SSY + 4-digit number',
          'Keep passbook and certificate safely',
          'Can be used for verification anywhere',
        ],
      },
      {
        number: 7,
        title: 'Continue Deposits Until Account Maturity',
        description: 'Maintain the account growth',
        substeps: [
          'Continue making annual deposits for maximum benefit',
          'Interest credited annually on April 1st',
          'You can track growth through passbook',
          'Account operates till girl turns 21 years',
          'Partial withdrawal allowed from age 18 for education',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Account Opening at Post Office',
        details: [
          'Visit with girl child and all documents',
          'Collector may verify girl\'s age',
          'Fill Form A with parent as guardian',
          'Submit birth certificate as proof of age',
          'Make initial deposit of ₹250 or more',
          'Receive passbook immediately',
          'Note down account number for reference',
        ],
      },
      {
        number: 2,
        title: 'Account Opening at Bank',
        details: [
          'Visit participating bank branch',
          'Approach savings account counter',
          'Collect SSY account opening form',
          'Fill with girl\'s details and parent information',
          'Submit documents as per bank requirements',
          'Deposit minimum ₹250',
          'Receive passbook and account certificate',
        ],
      },
    ],
    documents: [
      'Girl child\'s birth certificate (with seal)',
      'Girl child\'s Aadhaar or identity proof',
      'Parent/Guardian Aadhaar Card (original + copy)',
      'Parent/Guardian PAN Card (original + copy)',
      'Address proof (utility bill, ration card, lease)',
      'Cancelled cheque or bank statement',
      'Passport-sized photographs (4 copies)',
      'School enrollment certificate (if no birth certificate)',
    ],
    eligibility: [
      'Girl child must be below 10 years',
      'Indian citizen girl child',
      'Only 2 SSY accounts per family allowed',
      'Account must be opened by parents/legal guardian',
      'Account automatically transferred to girl on 18th birthday',
      'Can be opened for adopted girls as well',
    ],
    whereToApply: [
      'India Post offices (primary option)',
      'Authorized banks (SBI, Bank of Baroda, etc.)',
      'Scheduled commercial banks participating in scheme',
      'Government post offices in any region',
    ],
    penalties: [
      'Non-deposit penalty: Account becomes dormant if no deposit for 1 year, revival possible with ₹50 penalty',
      'Late deposit fine: ₹50 per year if deposits made after March 31st',
      'Early closure before 21 years: Only allowed in case of death or serious illness',
      'Withdrawal before 18 years: Not allowed except for specific health grounds',
    ],
    importantNotes: [
      'Account runs for 21 years from opening date',
      'Can be extended in 5-year blocks after maturity at girl\'s discretion',
      'Interest rate: 8% per annum (reviewed annually)',
      'Completely tax-free (EEE - Exempt-Exempt-Exempt status)',
      'Can withdraw from 18 years for education purpose',
      'Maximum withdrawal at age 18: 50% of balance',
      'Full maturity amount received at age 21',
      'Tax deduction under Section 80C for parents',
      'Opening between girl\'s age 1-10 recommended for maximum returns',
      'Can deposit via standing instruction for automation',
    ],
  },
  '3': {
    id: '3',
    name: 'National Savings Certificate',
    shortName: 'NSC',
    minimumAmount: '₹1,000',
    maximumAmount: 'No maximum limit',
    steps: [
      {
        number: 1,
        title: 'Understand NSC Variants',
        description: 'Know the different NSC options available',
        substeps: [
          'NSC VIII Issue: Standard 5-year certificate',
          'Check current interest rate (typically 7.7% per annum)',
          'Interest compounded annually',
          'Available at all post offices',
        ],
      },
      {
        number: 2,
        title: 'Gather Required Documents',
        description: 'Prepare necessary documentation',
        substeps: [
          'Aadhaar Card (original + copy)',
          'PAN Card (original + copy)',
          'Address proof (utility bill or ration card)',
          'Cancelled cheque or bank account details',
          'Passport-sized photographs (2-3 copies)',
          'Income proof (optional for amounts above ₹10 lakh)',
        ],
      },
      {
        number: 3,
        title: 'Visit Post Office',
        description: 'Go to your nearest post office',
        substeps: [
          'Locate the nearest India Post office',
          'Visit during working hours (typically 9 AM - 5 PM)',
          'Bring all documents',
          'Ask for NSC counter or assistant',
        ],
      },
      {
        number: 4,
        title: 'Fill NSC Investment Form',
        description: 'Complete the NSC application',
        substeps: [
          'Obtain NSC application form from post office',
          'Fill in personal details accurately',
          'Specify investment amount',
          'Mention nominee information',
          'Provide address and contact details',
          'Sign the form in designated areas',
        ],
      },
      {
        number: 5,
        title: 'Make Payment',
        description: 'Deposit your investment amount',
        substeps: [
          'Payment can be made in cash or cheque',
          'Minimum investment: ₹1,000',
          'Investment in multiples of ₹100 after ₹1,000',
          'Cheque should be in name of post office/payee',
          'Get receipt immediately',
        ],
      },
      {
        number: 6,
        title: 'Receive NSC Certificate',
        description: 'Collect your official NSC certificate',
        substeps: [
          'NSC certificate issued immediately or within 2-3 days',
          'Certificate displays investment amount and maturity details',
          'Keep certificate safely (proof of investment)',
          'Each NSC has unique serial number',
          'You can hold multiple NSCs',
        ],
      },
      {
        number: 7,
        title: 'Monitor Your Investment',
        description: 'Track your NSC growth',
        substeps: [
          'Interest compounded and added annually',
          'No physical payout until maturity',
          'Maturity amount automatically credited',
          'Can check post office details online',
          'After 5 years, you get principal + compound interest',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Single NSC Account Opening',
        details: [
          'Visit nearest post office with documents',
          'Fill NSC investment form with personal details',
          'Mention investment amount and nominee',
          'Make cash or cheque payment of ₹1,000 minimum',
          'Collect receipt and keep it safe',
          'NSC certificate issued (usually same day)',
          'Note serial number for future reference',
        ],
      },
      {
        number: 2,
        title: 'Joint NSC Account',
        details: [
          'Two persons can jointly invest in NSC',
          'Both parties required for withdrawal',
          'Fill joint form with details of both holders',
          'Both must sign the document',
          'Either party can nominate beneficiary',
          'Both signatures required during maturity withdrawal',
        ],
      },
      {
        number: 3,
        title: 'NSC for Minors',
        details: [
          'Parents/Guardians can invest on behalf of minor',
          'Guardian details required in form',
          'Minor\'s details and guardian signature needed',
          'Principal and interest belong to minor',
          'Transferred to minor on age of 18',
          'Withdrawn with minor\'s consent after 18',
        ],
      },
    ],
    documents: [
      'Aadhaar Card (primary identity proof)',
      'PAN Card (tax identification)',
      'Address proof (utility bill or postal address)',
      'Cancelled cheque or bank statement',
      'Passport-sized photographs (2-3 copies)',
      'Income proof (for investments above ₹10 lakh)',
      'Birth certificate (if opening for minor)',
      'Guardian ID proof (if opening for minor)',
    ],
    eligibility: [
      'Indian resident individuals',
      'NRI can hold through NRO account',
      'Joint holding allowed (max 3 persons)',
      'Can open for minors through guardian',
      'HUF can open NSC account',
      'Trusts and organizations can also invest',
    ],
    whereToApply: [
      'All India Post offices (primary)',
      'Post office branches in each district',
      'Sub-post offices in villages',
      'Online purchase from post office portal (limited)',
    ],
    penalties: [
      'Premature withdrawal after 1 year: Loss of 1 year interest',
      'Withdrawal between 1-3 years: Loss of last 4 months interest',
      'No withdrawal allowed in first 1 year',
      'After 5 years: Can withdraw without penalty',
    ],
    importantNotes: [
      'NSC is 5-year investment scheme',
      'Interest rate: 7.7% per annum (subject to change)',
      'Interest compounded annually (not paid periodically)',
      'Full interest earned is tax-free income',
      'Tax deduction under Section 80C available',
      'Can be pledged as security for loans',
      'Can be transferred between post offices',
      'Can be transferred to another person',
      'Nomination facility available for nominees',
      'Certificate can be renewed on maturity',
      'For amounts above ₹10 lakh, PAN mandatory',
    ],
  },
  '4': {
    id: '4',
    name: 'Kisan Vikas Patra',
    shortName: 'KVP',
    minimumAmount: '₹1,000',
    maximumAmount: 'No upper limit',
    steps: [
      {
        number: 1,
        title: 'Verify Your Eligibility',
        description: 'Check if you can invest in KVP',
        substeps: [
          'Indian citizens can invest directly',
          'Minor can invest through guardian/parent',
          'Joint account holders allowed',
          'HUF (Hindu Undivided Family) eligible',
          'Non-residents with NRO account can also invest',
        ],
      },
      {
        number: 2,
        title: 'Prepare Required Documents',
        description: 'Gather all necessary documents',
        substeps: [
          'Aadhaar Card (original + copy)',
          'PAN Card (original + copy)',
          'Utility bill or address proof',
          'Cancelled cheque or bank statement',
          'Passport-sized photographs (2-3)',
          'Identity proof additional copy',
          'Income proof if investment above ₹10 lakh',
        ],
      },
      {
        number: 3,
        title: 'Visit Authorized Post Office',
        description: 'Go to designated KVP selling post office',
        substeps: [
          'Locate post office authorized for KVP sales',
          'All government post offices sell KVP',
          'Go during office hours',
          'Bring original documents for verification',
        ],
      },
      {
        number: 4,
        title: 'Fill KVP Application Form',
        description: 'Complete the investment form',
        substeps: [
          'Obtain KVP application form',
          'Fill personal details accurately',
          'Specify investment amount (multiple of ₹1,000)',
          'Mention nominee name and details',
          'Provide contact information',
        ],
      },
      {
        number: 5,
        title: 'Make Your Investment',
        description: 'Pay the investment amount',
        substeps: [
          'Minimum investment: ₹1,000',
          'Investment in multiples of ₹100 after minimum',
          'Can pay in cash or cheque',
          'Get receipt with investment details',
          'Keep receipt safely',
        ],
      },
      {
        number: 6,
        title: 'Receive KVP Certificate',
        description: 'Collect your KVP document',
        substeps: [
          'KVP certificate issued immediately',
          'Certificate shows investment and maturity amount',
          'Maturity typically in 9 years 4 months',
          'Investment doubles in this period',
          'Keep certificate as proof',
        ],
      },
      {
        number: 7,
        title: 'Claim Maturity Amount',
        description: 'Withdraw at maturity',
        substeps: [
          'After 9 years 4 months, amount doubles',
          'You can claim maturity amount at post office',
          'Bring certificate and identity proof',
          'Amount credited to bank account or given as cash',
          'Option to reinvest available',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Individual KVP Investment',
        details: [
          'Adult with valid ID can open',
          'Visit nearest KVP-selling post office',
          'Collect and fill KVP application form',
          'Submit with photocopies of documents',
          'Make investment payment (₹1,000 minimum)',
          'Receive KVP certificate same day or next day',
          'Note certificate number for future reference',
        ],
      },
      {
        number: 2,
        title: 'Joint KVP Account',
        details: [
          'Two individuals can jointly invest',
          'Both parties must be present',
          'Both must provide their documents',
          'Joint form requires signatures of both',
          'Either party can withdraw after maturity',
          'Or nominee can withdraw',
          'Minimum ₹1,000 investment per joint account',
        ],
      },
      {
        number: 3,
        title: 'KVP for Minors',
        details: [
          'Guardian/Parent can invest on behalf of minor',
          'Guardian must provide their KYC documents',
          'Minor\'s details and relationship to guardian',
          'Guardian\'s signature on form',
          'Ownership transferred at age 18',
          'Guardian manages till minor turns 18',
        ],
      },
    ],
    documents: [
      'Aadhaar Card (original + photocopy)',
      'PAN Card (original + photocopy)',
      'Address proof (electricity bill or utility bill)',
      'Cancelled cheque or bank statement',
      'Passport-sized photographs (3 copies)',
      'Income proof (for investment above ₹10 lakh)',
      'Birth certificate (if opening for minor)',
      'Guardian document (if opening for minor)',
    ],
    eligibility: [
      'Indian residents (adults)',
      'Minors through guardian or parent',
      'Joint account holders (max 3 persons)',
      'HUF (Hindu Undivided Family)',
      'NRI with NRO account',
      'Age above 18 for individual account',
    ],
    whereToApply: [
      'Government post offices across India',
      'Sub-post offices in villages and towns',
      'All India Post official locations',
      'Authorized post office counters',
    ],
    penalties: [
      'Premature withdrawal after 2.5 years: 25% deduction from maturity value',
      'Withdrawal between 2.5-9.4 years: Graduated penalty (reducing over time)',
      'No withdrawal allowed before 2.5 years',
      'At maturity (9.4 years): Full amount received',
    ],
    importantNotes: [
      'KVP is designed for investment doubling over ~9.4 years',
      'Interest rate: 7.5% per annum (currently)',
      'Investment doubles to become maturity amount',
      'Rate of 7.5% ensures doubling in 9 years 4 months',
      'Interest is not paid periodically but credited at maturity',
      'Can be transferred to another person (needs consent)',
      'Can be pledged as collateral for loans',
      'Nomination facility available',
      'Tax deduction under Section 80C',
      'Interest income is subject to income tax',
      'Can hold multiple KVP certificates',
      'Certificate can be renewed or invested afresh at maturity',
    ],
  },
  '5': {
    id: '5',
    name: 'Senior Citizens Savings Scheme',
    shortName: 'SCSS',
    minimumAmount: '₹1,000',
    maximumAmount: '₹30 lakh',
    steps: [
      {
        number: 1,
        title: 'Verify Senior Citizen Eligibility',
        description: 'Check if you meet age requirements',
        substeps: [
          'Minimum age 60 years',
          'Retired persons aged 55-60 years (with proof)',
          'NRI can invest with NRO/NRE account',
          'HUF not eligible (only individuals)',
          'Joint account not allowed (single name only)',
        ],
      },
      {
        number: 2,
        title: 'Gather Required Documents',
        description: 'Prepare necessary documents',
        substeps: [
          'Aadhaar Card (original + copy)',
          'PAN Card (original + copy)',
          'Age proof (birth certificate or passport)',
          'Address proof (utility bill, ration card)',
          'Cancelled cheque or bank statement',
          'Passport-sized photographs (3-4 copies)',
          'Retirement certificate (if aged 55-59 years)',
        ],
      },
      {
        number: 3,
        title: 'Visit Post Office or Bank',
        description: 'Go to SCSS-authorized institution',
        substeps: [
          'Government post offices (primary)',
          'Authorized commercial banks',
          'Scheduled banks participating in scheme',
          'Visit during business hours',
          'Bring original documents for verification',
        ],
      },
      {
        number: 4,
        title: 'Fill SCSS Application Form',
        description: 'Complete the investment form',
        substeps: [
          'Obtain SCSS Form A (account opening form)',
          'Fill in senior citizen personal details',
          'Specify investment amount',
          'Mention nominee (heir to receive if you pass away)',
          'Provide contact details for communication',
          'Sign in designated spaces',
        ],
      },
      {
        number: 5,
        title: 'Make Initial Investment',
        description: 'Deposit your investment amount',
        substeps: [
          'Minimum investment: ₹1,000',
          'Maximum investment: ₹30 lakh',
          'Multiple deposits allowed up to limit',
          'Payment via cash, cheque, or online transfer',
          'Obtain official receipt',
        ],
      },
      {
        number: 6,
        title: 'Receive Certificate and Passbook',
        description: 'Collect official investment documents',
        substeps: [
          'SCSS certificate issued with account number',
          'Passbook showing investment and interest',
          'Interest rate mentioned on certificate',
          'Quarterly dividend schedule provided',
          'Keep documents safely',
        ],
      },
      {
        number: 7,
        title: 'Receive Quarterly Interest Payments',
        description: 'Collect interest every quarter',
        substeps: [
          'Interest paid quarterly (March, June, Sept, Dec)',
          'Can receive via cheque or direct bank transfer',
          'Option to set up standing instructions',
          'Interest is highest among all schemes',
          'Tax credit if TDS applicable',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Account Opening at Post Office',
        details: [
          'Senior citizen visits with documents',
          'Collect SCSS Form A from post office',
          'Fill form with personal and nominee details',
          'Attach age proof and address proof',
          'Submit with investment amount (₹1,000 minimum)',
          'Get receipt and account number',
          'Receive certificate and passbook',
        ],
      },
      {
        number: 2,
        title: 'Account Opening at Bank',
        details: [
          'Visit senior savings scheme counter',
          'Collect account opening form',
          'Provide all required documents',
          'Fill nominee information',
          'Make initial deposit',
          'Receive account certificate',
          'Set up interest payment method (cheque/transfer)',
        ],
      },
      {
        number: 3,
        title: 'Online Account Opening (if available)',
        details: [
          'Visit official post office or bank website',
          'Fill online SCSS application form',
          'Upload scanned documents',
          'Verify through OTP or digital signature',
          'Make online payment of investment',
          'Confirmation within 3-5 days',
          'Collect certificate or use digital copy',
        ],
      },
    ],
    documents: [
      'Age proof (birth certificate, passport, or ID)',
      'Aadhaar Card (original + copy)',
      'PAN Card (original + copy)',
      'Address proof (utility bill, lease, postal)',
      'Cancelled cheque or bank account details',
      'Passport-sized photographs (4 copies)',
      'Retirement certificate (if age 55-59)',
      'Medical certificate (if claiming age benefit)',
    ],
    eligibility: [
      'Senior citizens aged 60 years and above',
      'Retired individuals aged 55-60 years (with proof)',
      'Indian residents (NRI with NRO also eligible)',
      'Single name account (joint not allowed)',
      'HUF not eligible',
      'Individual senior citizens only',
    ],
    whereToApply: [
      'Government post offices (all branches)',
      'Scheduled commercial banks',
      'Major banks (SBI, Bank of Baroda, etc.)',
      'Authorized bank branches nationwide',
    ],
    penalties: [
      'Premature withdrawal before 1 year: 1% penalty on amount',
      'Withdrawal between 1-2 years: 1.5% penalty',
      'Withdrawal after 2 years: No penalty',
      'Account closure: Can close anytime after 1 year',
    ],
    importantNotes: [
      'SCSS is a 5-year scheme designed for senior citizens',
      'Interest rate: 8.2% per annum (reviewed quarterly)',
      'Interest paid quarterly in March, June, September, December',
      'Highest interest rate among all government schemes',
      'Can be extended for another 3-year period',
      'Extensions also get 8.2% interest',
      'Tax deduction under Section 80C (₹1.5 lakh limit)',
      'Interest income: TDS at 20% if exceeds ₹50,000 per year',
      'Investment limit: Maximum ₹30 lakh',
      'Nomination facility available',
      'Can withdraw funds anytime after 1 year',
      'Completely safe with government backing',
    ],
  },
  '6': {
    id: '6',
    name: 'Atal Pension Yojana',
    shortName: 'APY',
    minimumAmount: '₹42 per month (minimum)',
    maximumAmount: '₹500 per month',
    steps: [
      {
        number: 1,
        title: 'Determine Your Monthly Contribution',
        description: 'Decide on contribution amount based on desired pension',
        substeps: [
          'Minimum contribution: ₹42 per month (₹500 annual)',
          'Maximum contribution: ₹500 per month (₹6,000 annual)',
          'Your pension depends on contribution amount',
          'Government co-contributes 50% for first 5 years',
          'Use APY calculator to know expected pension',
        ],
      },
      {
        number: 2,
        title: 'Open Savings Bank Account',
        description: 'Ensure you have a valid bank account',
        substeps: [
          'APY requires active savings bank account',
          'Open account at any bank if not existing',
          'Provide KYC documents for bank account',
          'Account must have Aadhaar linked',
          'Account holder name must match APY application',
        ],
      },
      {
        number: 3,
        title: 'Gather APY Documents',
        description: 'Collect required documentation',
        substeps: [
          'Aadhaar Card (original + copy)',
          'Savings bank passbook or account statement',
          'Identity proof (voter ID, driving license)',
          'Address proof (utility bill, ration card)',
          'Cancelled cheque from your bank account',
          'Passport-sized photographs (2-3)',
          'Mobile number for verification',
        ],
      },
      {
        number: 4,
        title: 'Visit Bank or Authorized Agent',
        description: 'Go to APY enrollment center',
        substeps: [
          'Your own bank branch (easiest)',
          'Any post office with APY services',
          'Visit during business hours',
          'Bring all documents and bank account details',
          'Bring your Aadhaar for verification',
        ],
      },
      {
        number: 5,
        title: 'Fill APY Enrollment Form',
        description: 'Complete the registration form',
        substeps: [
          'Obtain APY enrollment form',
          'Fill personal details accurately',
          'Specify monthly contribution amount',
          'Mention nominee (who gets pension after you)',
          'Provide bank account details for auto-debit',
          'Sign and thumb-print on form',
        ],
      },
      {
        number: 6,
        title: 'Verify Aadhaar and Set Up Auto-debit',
        description: 'Complete verification process',
        substeps: [
          'OTP sent to Aadhaar-registered phone',
          'Enter OTP for verification',
          'Authorize auto-debit from bank account',
          'Choose debit date within month',
          'Confirmation received within 7-10 days',
        ],
      },
      {
        number: 7,
        title: 'Receive Registration and Start Contributing',
        description: 'Begin your pension journey',
        substeps: [
          'APY account number sent via SMS/email',
          'Account activated after first contribution debit',
          'Auto-debit happens on chosen date every month',
          'Government co-contribution added every quarter',
          'Track account through PFRDA website',
        ],
      },
      {
        number: 8,
        title: 'Receive Monthly Pension After Age 60',
        description: 'Claim your pension benefits',
        substeps: [
          'Automatic pension transfer at age 60',
          'Monthly pension amount based on contributions',
          'Pension credited to bank account on fixed date',
          'Pension continues till lifetime',
          'Nominee receives pension if you pass away',
        ],
      },
    ],
    accountCreation: [
      {
        number: 1,
        title: 'Bank Branch Enrollment',
        details: [
          'Visit your saving bank\'s branch',
          'Ask for APY enrollment counter',
          'Provide Aadhaar and bank account details',
          'Fill enrollment form with contribution choice',
          'Authorize auto-debit setup',
          'Verify through OTP',
          'Receive APY account number',
          'First contribution deducted after 5 days',
        ],
      },
      {
        number: 2,
        title: 'Post Office Enrollment',
        details: [
          'Visit nearest post office',
          'Go to APY counter if available',
          'Submit completed APY form with documents',
          'Provide bank account details for auto-debit',
          'Aadhaar verification done at post office',
          'Account created within 5-7 days',
          'Monthly contributions auto-deducted from bank',
        ],
      },
      {
        number: 3,
        title: 'Online Enrollment (through Bank)',
        details: [
          'Open bank\'s net banking portal',
          'Search for APY enrollment option',
          'Fill online form with personal details',
          'Select monthly contribution amount',
          'Verify through OTP or digital signature',
          'Authorize auto-debit',
          'Confirmation within 3-5 business days',
        ],
      },
    ],
    documents: [
      'Aadhaar Card (mandatory, original + copy)',
      'Savings bank passbook or statement',
      'Identity proof (voter ID, DL, or passport)',
      'Address proof (utility bill, ration card, lease)',
      'Cancelled cheque from bank account',
      'Passport-sized photographs (2 copies)',
      'Mobile number (for OTP verification)',
      'Email ID (for account communication)',
    ],
    eligibility: [
      'Age between 18-40 years only',
      'Indian citizen with Aadhaar card',
      'Active savings bank account required',
      'Bank account must be linked to Aadhaar',
      'Can contribute from any bank account holder',
      'Account available till age 60 (mandatory',
    ],
    whereToApply: [
      'Any commercial bank offering APY',
      'Post offices with APY services',
      'Online through bank net banking portal',
      'Authorized APY enrollment points',
    ],
    penalties: [
      'No penalties for contribution delays (contribution can be paid with late fee)',
      'If account lapses: Can be revived with late fee',
      'Early exit before 60: Allowed but subject to conditions',
      'Unpaid balance: Treated as debt to be repaid',
    ],
    importantNotes: [
      'APY is designed specifically for workers in informal sector',
      'Monthly pension: ₹1,000 to ₹5,000 (based on contribution)',
      'Government co-contributes 50% for first 5 years',
      'Co-contribution max: ₹600/year or 50% of contribution',
      'Contributions are tax-exempt (Section 80CCD)',
      'Pension starts automatically at age 60',
      'Minimum 20 years of contribution for full benefits',
      'If holder dies before 60: Nominee gets corpus',
      'If holder dies after 60: Spouse gets pension',
      'After spouse\'s death: Corpus goes to nominee',
      'Can enroll online or at bank branch',
      'No maximum income limit for eligibility',
    ],
  },
};

function SchemeDetailPage({ schemeId, onBack }: SchemeDetailPageProps) {
  const scheme = schemeDetails[schemeId];

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Schemes
          </button>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Scheme not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Schemes
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{scheme.name}</h1>
          <p className="text-lg text-gray-600">Complete Investment Guide & Registration Steps</p>
        </div>

        <div className="grid gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Facts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                <p className="text-xl font-bold text-blue-600">{scheme.minimumAmount}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Maximum Investment</p>
                <p className="text-xl font-bold text-green-600">{scheme.maximumAmount}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Scheme Name</p>
                <p className="text-xl font-bold text-purple-600">{scheme.shortName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-6">
              <FileText className="text-blue-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Step-by-Step Investment Guide</h2>
                <p className="text-gray-600">Follow these steps to invest in {scheme.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              {scheme.steps.map((step) => (
                <div key={step.number} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <ul className="space-y-2">
                        {step.substeps.map((substep, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle size={18} className="text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{substep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-6">
              <Users className="text-green-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Creation Methods</h2>
                <p className="text-gray-600">Choose how you want to open your account</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scheme.accountCreation.map((method) => (
                <div key={method.number} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Method {method.number}: {method.title}</h3>
                  <ul className="space-y-2">
                    {method.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-6">
              <FileText className="text-orange-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Documents Checklist</h2>
                <p className="text-gray-600">Ensure you have all documents before visiting</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scheme.documents.map((doc, idx) => (
                <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={20} className="text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-6">
              <Users className="text-blue-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Eligibility Requirements</h2>
                <p className="text-gray-600">Check if you meet all eligibility criteria</p>
              </div>
            </div>

            <ul className="space-y-3">
              {scheme.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <CheckCircle size={20} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start mb-6">
              <MapPin className="text-purple-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Where to Apply</h2>
                <p className="text-gray-600">Authorized institutions where you can invest</p>
              </div>
            </div>

            <div className="grid gap-3">
              {scheme.whereToApply.map((place, idx) => (
                <div key={idx} className="flex items-start p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700">{place}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="text-red-600 flex-shrink-0 mr-4" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Penalties & Restrictions</h2>
                <ul className="space-y-3">
                  {scheme.penalties.map((penalty, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-3 font-bold">⚠</span>
                      <span className="text-gray-700">{penalty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Points to Remember</h2>
            <ul className="space-y-3">
              {scheme.importantNotes.map((note, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
            <p className="text-gray-700 mb-6">
              You now have all the information needed to invest in {scheme.name}. Follow the step-by-step guide above and visit your nearest authorized institution with all required documents.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Back to All Schemes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemeDetailPage;

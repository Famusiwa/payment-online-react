import { Accordion, AccordionItem } from "@/components/custom/Accordion";

const FAQ: React.FC = () => {
  const faqData = [
    {
      id: "q1",
      title: "How do I Login?",
      answer: `If you already have an account, click on the Login button. Enter your STIN, Phone Number, or Email, then enter your password in the Password text box and click Login. If you don't have an account, you need to create one either as an Individual or as an Incorporated Body.<br />
      (a) To register as an Individual, click on "REGISTER FOR S-TIN" on the Homepage. You will be redirected to the registration page. From the dropdown options for 'Click to Slect a Payer Type', Click on 'Individual Payer', enter your phone number in the phone number text box provided, and click on Search. If you are not previously registered, a registration form will be displayed for you to fill. Complete the form and click on 'Register' at the bottom of the form. An activation link containing instructions on how to create a new access password will be sent to your registered email.<br />
      (b) To register as an Incorporated Body, click on "REGISTER FOR S-TIN" on the Homepage. You will be redirected to the registration page. From the dropdown options for 'Click to Slect a Payer Type', Click on 'Corporate Payer', enter your CAC number in the CAC number text box, and click on Search. If you are not previously registered, a registration form will be displayed for you to fill. Complete the form and click on 'Register' at the bottom of the form. An activation link containing instructions on how to create a new access password will be sent to your registered email.<br />
    `,
    },
    {
      id: "q2",
      title: "What is S-TIN?",
      answer:
        "S-TIN is a Unique State Tax Identification Number. Every Payer is issued an S-TIN upon successful registration.",
    },
    {
      id: "q3",
      title: "Where can I get my S-TIN?",
      answer: `Visit the State Internal Revenue Service Website, click on Info at the top, and select Info-Center. Click on "Search Organization S-TIN", enter your organization name in the search box, and click Submit. Copy your organization's S-TIN from the list if it's found.`,
    },
    {
      id: "q4",
      title: "I searched but could not find my organization's name in the list.",
      answer: `This means you are yet to be registered. Please check 'How do I login?' in the FAQ. Click on the Login button, then click on Get Password. Enter your S-TIN and click on Get Password. A password activation link will be sent to your registered email if it was provided during successful registration.`,
    },
    {
      id: "q5",
      title: "I Have S-TIN How do I get a Login Password?",
      answer: `Click on Login button, click on 'Sign up', enter your S-TIN click on Get Password, a password activation link will be sent to your registered email, if provided during successful registration.`,
    },
    {
      id: "q6",
      title: "What can I do on the Self Service Portal?",
      answer: `You can do the following on the Self Service Portal:<br />
      - File your PAYE Annual Return.<br />
      - File PAYE Monthly Schedule.<br />
      - File Form A Returns.<br />
      - File both Annual and Monthly Withholding Tax Returns.<br />
      - View your Assessment History.<br />
      - View your Payment History.<br />
      - View TCC Report.<br />
    `,
    },
    {
      id: "q7",
      title: `I forgot my password, how do I login?`,
      answer: `Click on the Login button, then click on Forgot Password. Enter your registered email and click on Reset Password. A password reset link will be sent to your registered email.`,
    },
    {
      id: "q8",
      title: `I did 'Get Password' and got this message: "Unable to send access password due to incomplete Agent/Payer information." What should I do?`,
      answer: `Visit the nearest Revenue Office to update your information, or send us an email (check the information section at the bottom for our email address) containing:<br />
      a. Full Name<br />
      b. Functional contact email address<br />
      c. Phone Number<br />
      d. i. Street Number ii. Street Name iii. Local Government<br />
      e. Nature of Business (use 'REQUEST FOR REGISTRATION UPDATE' as the subject of the email).<br />
    `,
    },
  ];

  return (
    <div>
      <div className="w-full mx-auto mt-2">
        <Accordion>
          {faqData.map((item) => (
            <AccordionItem key={item.id} id={item.id} title={item.title}>
              {item.answer.split("<br />").map((line, index) => (
                <p key={index} className="text-sm text-gray-700 mt-2">
                  {line}
                </p>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;

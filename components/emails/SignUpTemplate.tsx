import { Button, Heading, Html, Link, Section, Text } from '@react-email/components';

type SignUpTemplateProps = {
  name: string;
  verificationLink: string;
};
export const SignUpTemplate: React.FC<SignUpTemplateProps> = ({ name, verificationLink }) => (
  <Html>
    <Section>
      <Heading
        as='h1'
        className='text-lg font-bold'
      >
        Welcome, {name}!
      </Heading>

      <Text className='mt-4 text-base'>Thank you for signing up. Please verify your email address by clicking the button below.</Text>

      <Button
        href={verificationLink}
        style={{ background: '#000', color: '#fff', padding: '12px 20px', borderRadius: '8px' }}
      >
        Sign up
      </Button>

      <Text style={{ marginBottom: '0px' }}>In case you can&apos;t click the button, you can click the link below:</Text>
      <Link href={verificationLink}>{verificationLink}</Link>
    </Section>
  </Html>
);

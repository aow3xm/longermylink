import { Button, Heading, Html, Link, Section, Text } from '@react-email/components';

type ForgotPasswordTemplateProps = {
  name: string;
  resetLink: string;
};
export const ForgotPasswordTemplate: React.FC<ForgotPasswordTemplateProps> = ({ name, resetLink }) => (
  <Html>
    <Section>
      <Heading
        as='h1'
        className='text-lg font-bold'
      >
        Hello, {name}!
      </Heading>

      <Text className='mt-4 text-base'>We have received your password reset request. Please click the button below to start reset your password.</Text>

      <Button
        href={resetLink}
        style={{ background: '#000', color: '#fff', padding: '12px 20px', borderRadius: '8px' }}
      >
        Reset password
      </Button>

      <Text style={{ marginBottom: '0px' }}>In case you can&apos;t click the button, you can click the link below:</Text>
      <Link href={resetLink}>{resetLink}</Link>
    </Section>
  </Html>
);

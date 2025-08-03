import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  url: string;
  name: string;
}

export const VerificationEmailTemplate = ({
  url,
  name,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your BrainWeave account</Preview>
      <Container style={container}>
        {/* Logo and Brand Section */}
        <Section style={logoSection}>
          <Img
            src="logo.svg"
            width="48"
            height="48"
            alt="BrainWeave Logo"
            style={logo}
          />
          <Text style={brandName}>BrainWeave</Text>
        </Section>

        <Hr style={headerHr} />

        <Heading style={heading}>Welcome, {name}!</Heading>

        <Text style={paragraph}>
          Thank you for joining BrainWeave! We're excited to help you start
          weaving your thoughts together.
        </Text>

        <Text style={paragraph}>
          To get started, please verify your email address by clicking the
          button below:
        </Text>

        <Section style={buttonContainer}>
          <Button href={url} style={button}>
            Verify Email Address
          </Button>
        </Section>

        <Text style={smallText}>
          If the button doesn't work, you can also copy and paste this link into
          your browser:
        </Text>

        <Link href={url} style={linkText}>
          {url}
        </Link>

        <Hr style={hr} />

        <Text style={footer}>
          Best regards,
          <br />
          The BrainWeave Team
        </Text>

        <Text style={disclaimer}>
          If you didn't create a BrainWeave account, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

VerificationEmailTemplate.PreviewProps = {
  url: "https://brainweave.com/verify-email?token=abc123",
  name: "Vikram",
} as VerificationEmailProps;

export default VerificationEmailTemplate;

// Improved Styles
const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "580px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

const logoSection = {
  textAlign: "center" as const,
  padding: "20px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
};

const logo = {
  borderRadius: "8px",
};

const brandName = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1e293b",
  margin: "0",
  letterSpacing: "-0.025em",
};

const headerHr = {
  borderColor: "#e2e8f0",
  margin: "0 0 32px 0",
};

const heading = {
  fontSize: "28px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#1e293b",
  padding: "0 0 16px 0",
  margin: "0",
  textAlign: "center" as const,
};

const paragraph = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#475569",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6", // Your primary color
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
  lineHeight: "1.25",
};

const smallText = {
  margin: "16px 0 8px",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#64748b",
  textAlign: "center" as const,
};

const linkText = {
  fontSize: "14px",
  color: "#3b82f6",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  textAlign: "center" as const,
  display: "block",
  margin: "0 0 32px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footer = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#475569",
  margin: "0 0 16px",
};

const disclaimer = {
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#94a3b8",
  margin: "0",
  textAlign: "center" as const,
};

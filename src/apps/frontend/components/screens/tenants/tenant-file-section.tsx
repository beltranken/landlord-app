import { Text, TextH2 } from "@/components/atoms/text";
import CardSection from "@/components/molecules/card-section/card-section-ui";
import { TenantAddDocumentButton } from "./tenant-add-document-button";
import TenantFileCard from "./tenant-file-card";

type TenantFileSectionProps = {
  tenantId: number;
  files?: Array<{
    id: number | string;
  }>;
};

export default function TenantFileSection({
  tenantId,
  files,
}: TenantFileSectionProps) {
  const hasFiles = !!files && files.length > 0;

  return (
    <CardSection>
      <TextH2>Documents</TextH2>

      {hasFiles ? (
        files!.map((file) => (
          <TenantFileCard key={file.id} file={file as any} />
        ))
      ) : (
        <Text>No documents uploaded yet.</Text>
      )}

      <TenantAddDocumentButton tenantId={tenantId} />
    </CardSection>
  );
}

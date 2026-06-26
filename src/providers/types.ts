export interface GenerateParams {
  position: string;
  company: string;
  tone: string;
  jobDescription?: string;
  resumeText?: string;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
}

export interface AIProvider {
  generate(params: GenerateParams): Promise<string>;
}

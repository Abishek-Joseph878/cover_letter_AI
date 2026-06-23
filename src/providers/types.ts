export interface GenerateParams {
  position: string;
  company: string;
  tone: string;
  jobDescription?: string;
  resumeText?: string;
}

export interface AIProvider {
  generate(params: GenerateParams): Promise<string>;
}

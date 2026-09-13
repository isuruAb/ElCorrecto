IF NOT EXISTS (
  SELECT * FROM sys.tables WHERE name = 'Profiles' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
  CREATE TABLE dbo.Profiles (
    Email NVARCHAR(320) NOT NULL PRIMARY KEY,
    Countries NVARCHAR(MAX) NOT NULL,
    Positions NVARCHAR(MAX) NOT NULL,
    Seniority NVARCHAR(MAX) NOT NULL,
    ResumeFileName NVARCHAR(500) NULL,
    ResumeBlobUrl NVARCHAR(1000) NULL,
    UpdatedAt DATETIME2 NOT NULL
  );
END

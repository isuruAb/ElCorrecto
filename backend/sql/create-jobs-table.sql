IF NOT EXISTS (
  SELECT * FROM sys.tables WHERE name = 'Jobs' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
  CREATE TABLE dbo.Jobs (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    SortOrder INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Company NVARCHAR(200) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    EmploymentType NVARCHAR(20) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    TechStack NVARCHAR(MAX) NOT NULL
  );
END

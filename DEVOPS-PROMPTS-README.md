# DevOps Prompts for VS Code

This collection provides specialized AI prompts for common DevOps tasks, designed to work with VS Code's AI features.

## Available Prompts

### 1. Infrastructure as Code Review (`iac-review.prompt.yml`)
- **Purpose**: Reviews Infrastructure as Code configurations
- **Use Case**: Terraform, CloudFormation, ARM templates, etc.
- **Variables**: `iac_type`, `purpose`, `iac_code`

### 2. CI/CD Pipeline Optimizer (`cicd-optimizer.prompt.yml`)
- **Purpose**: Analyzes and optimizes CI/CD pipelines
- **Use Case**: GitHub Actions, Jenkins, GitLab CI, etc.
- **Variables**: `issues`, `tech_stack`, `team_size`, `pipeline_config`

### 3. Security Scan Analyzer (`security-scan-analyzer.prompt.yml`)
- **Purpose**: Analyzes security scanning results
- **Use Case**: SAST, DAST, dependency scanning results
- **Variables**: `scan_type`, `environment`, `risk_threshold`, `scan_results`

### 4. Deployment Strategy Planner (`deployment-planner.prompt.yml`)
- **Purpose**: Plans optimal deployment strategies
- **Use Case**: Application deployments, feature releases
- **Variables**: `app_type`, `infrastructure`, `user_base`, `requirements`, `risk_tolerance`, `context`

### 5. Monitoring Setup Advisor (`monitoring-advisor.prompt.yml`)
- **Purpose**: Designs monitoring and alerting configurations
- **Use Case**: Application and infrastructure monitoring
- **Variables**: `service_name`, `tech_stack`, `infrastructure`, `sla_requirements`, `key_metrics`

### 6. Incident Response Planner (`incident-response.prompt.yml`)
- **Purpose**: Creates incident response plans and runbooks
- **Use Case**: System incidents, outages, security events
- **Variables**: `incident_type`, `system_name`, `impact_level`, `team_structure`

## How to Use

1. **Install VS Code Prompts Extension**: Ensure you have the VS Code prompts feature enabled
2. **Load Prompts**: Place these `.prompt.yml` files in your workspace or VS Code prompts directory
3. **Invoke Prompts**: Use VS Code's command palette or chat interface to run these prompts
4. **Provide Variables**: Fill in the template variables with your specific context

## Example Usage

For IaC review, you might invoke it like:
```
/iac-review iac_type="Terraform" purpose="Web application infrastructure" iac_code="your terraform code here"
```

## Integration with CI/CD

These prompts work well with:
- GitHub Actions workflows
- GitLab CI pipelines
- Jenkins pipelines
- Azure DevOps
- Automated code review processes

## Customization

Feel free to modify these prompts to match your organization's specific:
- Coding standards
- Security policies
- Tool preferences
- Team processes
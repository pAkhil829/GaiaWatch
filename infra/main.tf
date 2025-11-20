# 1. Configure Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# 2. Create a Resource Group (A container for everything)
resource "azurerm_resource_group" "rg" {
  name     = "gaiawatch-resources"
  location = "West US 2"
}

# 3. Create Cosmos DB (Database) - FREE TIER ENABLED
resource "azurerm_cosmosdb_account" "db" {
  name                = "gaiawatch-db-${random_integer.suffix.result}" # Unique name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  free_tier_enabled    = true # <--- IMPORTANT: This makes it free

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

# 4. Random Number for Unique Name
resource "random_integer" "suffix" {
  min = 10000
  max = 99999
}

# 5. Output the connection strings
output "cosmos_db_endpoint" {
  value = azurerm_cosmosdb_account.db.endpoint
}
# 6. Create Static Web App (The Website + API Host)
resource "azurerm_static_site" "web" {
  name                = "gaiawatch-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "West US 2" # Static Apps are global, but we pick a region for metadata
  sku_tier            = "Free"      # <--- 100% Free
  sku_size            = "Free"
}

# 7. Output the Deployment Token (The Key for GitHub)
output "deployment_token" {
  value     = azurerm_static_site.web.api_key
  sensitive = true
}
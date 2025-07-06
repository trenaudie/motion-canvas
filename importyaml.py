#%%
import yaml

# %%
YAMLFILEPATH = 'llm_prompts.yaml'
YAMLFILEPATH = 'prompts/coder_general_01.yaml'
# %%
with open(YAMLFILEPATH, 'r') as file:
    data = yaml.safe_load(file)
# %%
data
# %%
import json 

# %%

print(json.dumps(data, indent=4))
# %%

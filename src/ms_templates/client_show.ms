{{#client}}
<form action="/clients/{{id}}" method="put">
<fieldset>
  <label>Client ID: {{id}}
    <input type="hidden" name="client_id" value="{{id}}" />
  </label><br />
  <label>Client name:
    <input type="text" name="name" class="field" value="{{name}}" required />
  </label><br />
  <label>Client secret:
    <input type="text" name="secret" class="field" value="{{secret}}" required />
  </label>
  <a href="#" class="generate_secret">Generate random string</a>
  <br />
  <label>Redirect URI:
    <input type="text" name="redirect_uri" class="field" value="{{redirect_uri}}" />
  </label><br />

  <input class="button" value="Cancel" type="reset" />  
  <input class="button" value="Update" type="submit" />
  <input class="button delete" value="Delete" type="submit" formmethod="delete" />

</fieldset></form>
{{/client}}

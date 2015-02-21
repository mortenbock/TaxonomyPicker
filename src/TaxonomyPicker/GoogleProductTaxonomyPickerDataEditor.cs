using System;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaxonomyPicker;
using umbraco.cms.businesslogic.datatype;
using umbraco.editorControls;

[assembly: WebResource("TaxonomyPicker.GoogleProductTaxonomyPicker.js", "application/x-javascript")]
[assembly: WebResource("TaxonomyPicker.GoogleProductTaxonomyPicker.css", "text/css")]
[assembly: WebResource(GoogleProductTaxonomyPickerDataEditor.taxfileresource, "text/plain")]

namespace TaxonomyPicker
{
	public class GoogleProductTaxonomyPickerDataEditor : Panel
	{
		public const string taxfileresource = "TaxonomyPicker.taxonomy.txt";
		public string TaxonomyFileUrl { get; set; }

		protected TextBox TextBoxControl { get; set; }

		public string Text
		{
			get { return TextBoxControl.Text; }

			set
			{
				if (TextBoxControl == null)
				{
					TextBoxControl = new TextBox();
				}

				TextBoxControl.Text = value;
			}
		}

		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);
			EnsureChildControls();
		}

		protected override void OnLoad(EventArgs e)
		{
			base.OnLoad(e);
			this.RegisterEmbeddedClientResource("TaxonomyPicker.GoogleProductTaxonomyPicker.js", ClientDependencyType.Javascript);
			this.RegisterEmbeddedClientResource("TaxonomyPicker.GoogleProductTaxonomyPicker.css", ClientDependencyType.Css);
		}

		protected override void CreateChildControls()
		{
			base.CreateChildControls();
			EnsureChildControls();

			if (TextBoxControl == null)
			{
				TextBoxControl = new TextBox();
			}

			TextBoxControl.ID = TextBoxControl.ClientID;
			TextBoxControl.CssClass = "gptp-valueTxt umbEditorTextField";

			Controls.Add(TextBoxControl);
		}

		protected override void Render(HtmlTextWriter writer)
		{
			writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
			writer.RenderBeginTag(HtmlTextWriterTag.Div);
			{
				writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-spacebottom");
				writer.RenderBeginTag(HtmlTextWriterTag.Div);

				{
					TextBoxControl.RenderControl(writer);
				}

				{
					writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-selectBtn");
					writer.AddAttribute(HtmlTextWriterAttribute.Type, "button");
					writer.RenderBeginTag(HtmlTextWriterTag.Button);
					writer.WriteEncodedText("Select");
					writer.RenderEndTag();
				}

				writer.RenderEndTag();
			}


			{
				writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-selector-area");
				writer.RenderBeginTag(HtmlTextWriterTag.Div);

				{
					writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-spacebottom");
					writer.RenderBeginTag(HtmlTextWriterTag.Fieldset);
					writer.RenderBeginTag(HtmlTextWriterTag.Legend);
					writer.WriteEncodedText("Select from categories");
					writer.RenderEndTag();
					{
						writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-ddlcontainer");
						writer.RenderBeginTag(HtmlTextWriterTag.Div);
						writer.RenderEndTag();
					}
					writer.RenderEndTag();
				}
				{
					writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-spacebottom");
					writer.RenderBeginTag(HtmlTextWriterTag.Fieldset);
					writer.RenderBeginTag(HtmlTextWriterTag.Legend);
					writer.WriteEncodedText("Search");
					writer.RenderEndTag();
					{
						writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-search");
						writer.RenderBeginTag(HtmlTextWriterTag.Div);
						{
							writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-searchTxt umbEditorTextField");
							writer.AddAttribute(HtmlTextWriterAttribute.Type, "search");
							writer.RenderBeginTag(HtmlTextWriterTag.Input);
							writer.RenderEndTag();
						}

						{
							writer.AddAttribute(HtmlTextWriterAttribute.Class, "gptp-searchresults");
							writer.RenderBeginTag(HtmlTextWriterTag.Div);
							writer.RenderEndTag();
						}
						writer.RenderEndTag();
					}
					writer.RenderEndTag();
				}

				writer.RenderEndTag();
			}


			writer.RenderEndTag();


			string taxFileUrl;
			if (string.IsNullOrWhiteSpace(TaxonomyFileUrl))
			{
				var clientScriptManager = Page.ClientScript;
				var type = typeof(GoogleProductTaxonomyPickerDataEditor);
				taxFileUrl = clientScriptManager.GetWebResourceUrl(type, taxfileresource);
			}
			else
			{
				taxFileUrl = TaxonomyFileUrl;
			}

			var javascriptMethod = string.Format("jQuery('#{0} .gptp-selectBtn').click(function(){{jQuery('#{0}').GoogleProductTaxonomyPicker('{1}');}});", ClientID, HttpUtility.JavaScriptStringEncode(taxFileUrl));
			var javascript = string.Concat("<script type='text/javascript'>jQuery(window).load(function(){", javascriptMethod, "});</script>");
			writer.WriteLine(javascript);
		}
	}
}
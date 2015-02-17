using System;
using umbraco.cms.businesslogic.datatype;

namespace TaxonomyPicker
{
    public class GoogleProductTaxonomyPickerDataType : AbstractDataEditor
    {
		[DataEditorSetting("Taxonomy File Url")]
		public string TaxonomyFileUrl { get; set; }

		private readonly GoogleProductTaxonomyPickerDataEditor m_Editor = new GoogleProductTaxonomyPickerDataEditor();

	    public override string DataTypeName
	    {
			get { return "Google Product Taxonomy Picker"; }
	    }

	    public override Guid Id
	    {
		    get { return new Guid("EBB3E7AF-B7C9-42DB-AEC1-BAD3032B115F"); }
	    }

	    public GoogleProductTaxonomyPickerDataType()
	    {
		    RenderControl = m_Editor;
			m_Editor.Init += m_Editor_Init;
			DataEditorControl.OnSave += DataEditorControl_OnSave;
	    }

		void DataEditorControl_OnSave(EventArgs e)
		{
			Data.Value = m_Editor.Text;
		}

		void m_Editor_Init(object sender, EventArgs e)
		{
			m_Editor.TaxonomyFileUrl = TaxonomyFileUrl;
			var value = Data.Value;
			m_Editor.Text = value != null ? value.ToString() : string.Empty;
		}
    }
}
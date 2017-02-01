//jQuery(document).ready(function () { alert("Hello from the ./js/dataform_menu.js!"); });

(function ($) {
  $(document).ready(function(){
    alert("Hello world added js in the ./misc/dataform_menu.js!");  //here we can add our JS code
  })

})(jQuery);


/*

def autocomplete
    #puts "In autocomplete for autosuggesting the gene names !"
    gene_set_id = session[:gene_set_id] 
    @genes = Gene.order(:name).where("name LIKE ? and gene_set_id = ?", "%#{params[:term]}%", gene_set_id).limit(20)

    respond_to do |format|
      format.html
      format.json { 
        render json: @genes.map(&:name)
      }
    end
  end
*/
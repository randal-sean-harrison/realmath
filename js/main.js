$(function () {

   // Load Header and footer ----------------------------------------------------------
   $("#site-header").load("header.html", function () {
      console.log("Header loaded.");
   });

   $("#site-footer").load("footer.html", function () {
      console.log("Footer loaded.");
      // Add the current year to copyright
      const thisYear = new Date().getFullYear();
      $("#footer-year").text(thisYear);

   });

   // Reset form button -----------------------------------------------------------------
   $("#dialog-confirm").dialog({
      autoOpen: false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
         "Cancel": function () {
            $(this).dialog("close");
         },
         "Reset": function () {
            // Turns the green checked circles to open empty circles
            window.location.reload(true);
            //
            // // Stop propagation of the event
            // event.stopPropagation();
            // // Close the dialog
            // $("#dialog-confirm").dialog("close");
         }
      }
   });

   // Reset button ----------------------------------------------------------------------
   $('#reset-form').on("click", function () {

      // Open the dialog box onClick
      $("#dialog-confirm").dialog("open");

      // remove the close button on the modal
      $(".ui-dialog-titlebar-close").remove();
      $(".ui-icon-alert").remove();
      $(".ui-dialog-buttonset button:first-of-type").addClass("btn btn-default bg-light");
      $(".ui-dialog-buttonset button:last-of-type").addClass("btn btn-primary");
   });

   // Zeno Rocha's copy utility ------------------------------------------------------------
   new ClipboardJS('.copy-btn', {
      target: function (trigger) {
         return trigger.nextElementSibling;
      }
   });

   // mathLive functions --------------------------------------------------------------------
   const mathInput = document.getElementById('math-input');
   const latexOutput = document.getElementById('latex-output');
   const jsOutput = document.getElementById('js-output');

   // Update textarea whenever the mathfield content changes
   $('#math-input').on('input change', function () {
      const latex = mathInput.getValue();
      latexOutput.value = latex;


      jsOutput.value = convertLatexToJs(latex);

   });

   // Convert LaTeX markdown to JS -----------------------------------------------------------
   function convertLatexToJs(theLatex) {
      // Log the input for debugging
      console.log("Original LaTeX:", theLatex);

      // Basic parsing for fraction, square roots, and exponents
      let jsExpression = theLatex
         .replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '($1 / $2)')

         // Replace ^ for exponents with ** (e.g., x^2 to x**2)
         .replace(/\^/g, '**')

         // Replace \sqrt{x} with Math.sqrt(x)
         .replace(/\\sqrt{([^{}]+)}/g, 'Math.sqrt($1)')

         // Replace Greek symbols, e.g., \alpha to α (Unicode for alpha)
         .replace(/\\alpha/g, 'α')
         .replace(/\\beta/g, 'β')
         .replace(/\\gamma/g, 'γ')
         // Add more Greek symbols as needed

         // Replace common LaTeX functions with JavaScript equivalents
         .replace(/\\sin/g, 'Math.sin')
         .replace(/\\cos/g, 'Math.cos')
         .replace(/\\tan/g, 'Math.tan')
         .replace(/\\log/g, 'Math.log')

         // Replace braces with parentheses for function calls
         .replace(/{/g, '(')
         .replace(/}/g, ')')

         // Convert LaTeX multiplication to Javascript multiplication
         .replace(/\\cdot/g, '*');

      // Log the output JS expression for debugging
      console.log("Converted JS Expression:", jsExpression);

      return jsExpression;
   }

   // Create the QR code from the formula -------------------------------------------------------
   $("#qr-create").on("click", function () {
      // concatenate the equation
      let theEquation = $("#js-output").val();
      let encodedUriComponent = encodeURIComponent(theEquation);
      let eightWallUrl = "https://ndlearning.8thwall.app/ar-math-viewer/" + encodedUriComponent;

      // Clear any previous qr code
      $("#qr-code").empty();

      // Generate and write new QR code
      new QRCode(document.querySelector("#qr-code"), {
         text: eightWallUrl,
         width: 256,
         height: 256,
         colorDark: "#000000",
         colorLight: "#ffffff",
         correctLevel: QRCode.CorrectLevel.L
      });

      // Write the image to the modal
      $(".modal").find(".modal-body > p").text(theEquation);
      $(".modal").find(".modal-title").text("QR Code");

      // Display the modal
      $('#gallery-modal').modal('show');

   });



   // Adding a hover effect to the cards --------------------------------------------------------
   $('.card').on('hover', function () {
      $(this).addClass("shadow-sm"); // Mouse enters
   });


   // Clear the selection -----------------------------------------------------------------------
   function clearSelection() {
      if (window.getSelection) {
         // Modern browsers
         window.getSelection().removeAllRanges();
      } else if (document.selection) {
         // Older versions of IE
         document.selection.empty();
      }
   }

   $(".copy-btn").on("click", function () {
      clearSelection();
   });


   // Show the QR code for each card button --------------------------------------------------------
   $(".modal-btn").on("click", function () {

      // Clear any previous qr code
      $("#qr-code").empty("");

      // Get the image, title, and description for each card
      const projectQrCode = $(this).data("qr-code-image");
      const projectDescription = $(this).parent().parent().find(".card-text").text();
      const projectTitle = $(this).parent().parent().find(".card-title").text();

      // Write the image to the modal
      $(".modal").find(".modal-body > p").text(projectDescription);
      $(".modal").find(".modal-title").text(projectTitle);

      // Display the modal
      $('#gallery-modal').modal('show');

   });

});
// document.ready

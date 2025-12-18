import pikepdf
import sys

# CONFIGURACIÓN
TEMPLATE_PDF = "cv_template.pdf"  # El PDF que exportaste de Pages
PLACEHOLDER = "VAR_CLIENTE"       # El texto que pusiste en la URL en Pages

def generar_cv(empresa):
    # Abrimos el PDF
    pdf = pikepdf.Pdf.open(TEMPLATE_PDF)
    
    contador = 0
    uris = []
    
    # Recorremos todas las páginas
    for page in pdf.pages:
        # Buscamos si la página tiene anotaciones (enlaces)
        if "/Annots" in page:
            for annot in page["/Annots"]:
                print()
                print(annot)
                # Verificamos si es un enlace web (Action -> URI)
                if "/A" in annot and "/URI" in annot["/A"]:
                    uri_actual = str(annot["/A"]["/URI"])
                    
                    # Si la URL contiene nuestra variable...
                    if PLACEHOLDER in uri_actual:
                        # Reemplazamos la variable por el nombre de la empresa
                        nueva_uri = uri_actual.replace(PLACEHOLDER, empresa)
                        
                        # Guardamos el cambio en el objeto PDF
                        annot["/A"]["/URI"] = nueva_uri
                        uris.append(uri_actual)
                        contador += 1

    # Guardamos el archivo nuevo
    nombre_salida = f"CV_{empresa.capitalize()}.pdf"
    pdf.save(nombre_salida)
    print(f"✅ ¡Listo! Se actualizaron {contador} enlaces.")
    for uri in uris:
        print(f"    - ", uri)
    print(f"📄 Archivo generado: {nombre_salida}")

# Lógica para pedir el nombre
if __name__ == "__main__":
    if len(sys.argv) > 1:
        nombre_empresa = sys.argv[1]
    else:
        nombre_empresa = input("Introduce el nombre de la empresa (utm_source): ")
    
    generar_cv(nombre_empresa.strip())
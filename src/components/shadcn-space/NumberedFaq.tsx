// Adapted from Shadcn Space's free Accordion 03 (Numbered FAQ).
// https://shadcnspace.com/r/accordion-03.json
import { Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function NumberedFaq({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <Accordion type="single" collapsible className="numbered-faq">
      {items.map((faq, index) => (
        <AccordionItem
          key={faq.question}
          value={`item-${index}`}
          className="faq-item group/item"
        >
          <AccordionTrigger className="faq-trigger">
            <span className="faq-question">
              <span className="faq-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {faq.question}
            </span>
            <span className="faq-toggle">
              <Plus className="faq-plus" size={17} />
              <Minus className="faq-minus" size={17} />
            </span>
          </AccordionTrigger>
          <AccordionContent className="faq-answer">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

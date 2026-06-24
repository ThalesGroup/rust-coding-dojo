// TODO: Implement a Mathematical AST with Visitor pattern
//
// Step 1: Define AST nodes
//   - Number(f64)
//   - Add(Box<Expr>, Box<Expr>)
//   - Sub(Box<Expr>, Box<Expr>)
//   - Mul(Box<Expr>, Box<Expr>)
//   - Div(Box<Expr>, Box<Expr>)
//
// Step 2: Implement parse_rpn(expr: &str) -> Result<Expr, String>
//   Parse a space-separated RPN expression using a stack
//
// Step 3: Implement evaluate(expr: &Expr) -> f64
//   Recursively evaluate the AST
//
// Step 4: Implement pretty_print(expr: &Expr) -> String
//   e.g., "3 6 +" -> "(3 + 6)"
//        "3 6 2 * +" -> "(3 + (6 * 2))"

#[derive(Debug, Clone)]
pub enum Expr {
    Number(f64),
    Add(Box<Expr>, Box<Expr>),
    Sub(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Div(Box<Expr>, Box<Expr>),
}

pub fn parse_rpn(expr: &str) -> Result<Expr, String> {
    todo!("Parse RPN expression into AST")
}

pub fn evaluate(expr: &Expr) -> f64 {
    todo!("Evaluate the AST recursively")
}

pub fn pretty_print(expr: &Expr) -> String {
    todo!("Pretty-print the AST as infix notation with parentheses")
}

fn main() {
    let expr = parse_rpn("3 6 +").unwrap();
    println!("Value: {}", evaluate(&expr));
    println!("Pretty: {}", pretty_print(&expr));

    let nested = parse_rpn("3 6 -6 * +").unwrap();
    println!("Nested value: {}", evaluate(&nested));
    println!("Nested pretty: {}", pretty_print(&nested));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_number() {
        let e = parse_rpn("42").unwrap();
        assert!((evaluate(&e) - 42.0).abs() < 0.001);
    }

    #[test]
    fn simple_addition() {
        let e = parse_rpn("3 6 +").unwrap();
        assert!((evaluate(&e) - 9.0).abs() < 0.001);
    }

    #[test]
    fn nested_expression() {
        let e = parse_rpn("3 6 -6 * +").unwrap();
        assert!((evaluate(&e) - (-33.0)).abs() < 0.001);
    }

    #[test]
    fn pretty_print_addition() {
        let e = parse_rpn("3 6 +").unwrap();
        assert_eq!(pretty_print(&e), "(3 + 6)");
    }

    #[test]
    fn pretty_print_nested() {
        let e = parse_rpn("3 6 2 * +").unwrap();
        assert_eq!(pretty_print(&e), "(3 + (6 * 2))");
    }

    #[test]
    fn unknown_token_returns_error() {
        assert!(parse_rpn("3 x +").is_err());
    }

    #[test]
    fn division() {
        let e = parse_rpn("10 2 /").unwrap();
        assert!((evaluate(&e) - 5.0).abs() < 0.001);
    }
}
